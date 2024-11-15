MAKEFLAGS += -j3
DOCKER=docker
KUBECTL=kubectl
GIT_REV=$(shell git rev-parse --short HEAD)
CONTAINER_BASE=localhost/warena

export KUBECONFIG=./helm/kubeconfig-default.yaml

container-build-backend:
	$(DOCKER) build \
    	--target=release \
    	-f="./backend/Dockerfile" \
    	-t="$(CONTAINER_BASE)-backend:$(GIT_REV)" \
    	--progress=plain "."

container-build-frontend:
	$(DOCKER) build \
    	--target=release \
    	-f="./frontend/Dockerfile" \
    	-t="$(CONTAINER_BASE)-frontend:$(GIT_REV)" \
    	--progress=plain "."

container-build: container-build-backend container-build-frontend

container-push:
	REMOTE_IMAGES="$$(bash ./kubectl-node_shell "$$($(KUBECTL) get node -o 'jsonpath={.items[0].metadata.name}')" -- ctr image ls)"; \
	if  echo "$$REMOTE_IMAGES" | grep -q "$(CONTAINER_BASE)-backend:$(GIT_REV)" && \
		echo "$$REMOTE_IMAGES" | grep -q "$(CONTAINER_BASE)-frontend:$(GIT_REV)"; \
	then \
		echo "Images already exists"; \
	else \
		echo "Pushing images"; \
		$(DOCKER) image save "$(CONTAINER_BASE)-backend:$(GIT_REV)" "$(CONTAINER_BASE)-frontend:$(GIT_REV)" "$(CONTAINER_BASE)-admin-frontend:$(GIT_REV)" | \
			gzip -7 | \
			bash ./kubectl-node_shell "$$($(KUBECTL) get node -o 'jsonpath={.items[0].metadata.name}')" -- \
				sh -c "cat | gzip -d | ctr image import -"; \
	fi

secrets-encrypt:
	[ -f ./helm/.secret-key ] || (echo "Secret key not found"; exit 1)
	$(foreach file, $(wildcard ./helm/values-*.yaml ./helm/kubeconfig-*.yaml), \
		openssl aes-256-cbc -e -base64 \
			-md sha512 -pbkdf2 -iter 100000 \
			-kfile ./helm/.secret-key \
			-in $(file) -out $(patsubst %.yaml,%.yaml.aes,$(file)); \
	)

secrets-decrypt:
	[ -f ./helm/.secret-key ] || (echo "Secret key not found"; exit 1)
	$(foreach file, $(wildcard ./helm/values-*.yaml.aes ./helm/kubeconfig-*.yaml.aes), \
		openssl aes-256-cbc -d -base64 \
			-md sha512 -pbkdf2 -iter 100000 \
			-kfile ./helm/.secret-key \
			-in $(file) -out $(patsubst %.yaml.aes,%.yaml,$(file)); \
	)

secrets-clear:
	rm -f ./helm/values-*.yaml ./helm/kubeconfig-*.yaml

deploy-main:
	$(MAKE) secrets-decrypt
	$(KUBECTL) get ns warena-main > /dev/null || (echo 'Namespace does not exists' && exit 1)
	$(MAKE) container-build
	$(MAKE) container-push
	helm upgrade --install \
		--atomic --timeout 10m \
		warena-main -n warena-main \
		./helm -f ./helm/values-main.yaml \
		--set "gitRev=$(GIT_REV)" \
		--set "backend.image=$(CONTAINER_BASE)-backend:$(GIT_REV)" \
		--set "frontend.image=$(CONTAINER_BASE)-frontend:$(GIT_REV)"
	$(MAKE) secrets-clear
