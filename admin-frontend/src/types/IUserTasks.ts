export interface IUserTasks {
  id: string
  active: boolean
  name: string
  name_i18n_key: string
  image: string
  type: 0 | 1 | 2
  target: Record<string, any>
  reward: string
  created_at: string
}
