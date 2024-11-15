import {Command} from 'commander'
import {createHttpServer} from '@/http'
import {onShutdown} from '../util/process.ts'
import {safePromise} from '../util/func.ts'
import {databaseConnect, databaseDisconnect} from '@/db'
import {redisConnect, redisDisconnect} from '@/services/redis.ts'
import {registerUserApiRoutes} from '@/http/user-api'

export default function httpCliCommands(cmd: Command) {
  cmd.command('http')
    .description('Starts an http server')
    .action(async () => {
      const http = createHttpServer()

      onShutdown(async (code) => {
        http.log.info(`Shutting down with ${code}`)
        await safePromise(http.close())
        await safePromise(redisDisconnect())
        await safePromise(databaseDisconnect())
      })

      await redisConnect()
      await databaseConnect()

      http.register(registerUserApiRoutes)

      await http.listen({
        host: '0.0.0.0',
        port: 8000,
      })
    })
}
