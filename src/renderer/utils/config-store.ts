import { IAppMainAPI, IConfig } from '@src/contract.js'
import { go } from '@blackglory/prelude'
import { Store, createStoreContext } from 'extra-react-store'
import { ClientProxy } from 'delight-rpc'

export class ConfigStore extends Store<IConfig> {
  constructor(
    private client: ClientProxy<IAppMainAPI>
  , initialValue: IConfig
  ) {
    super(initialValue)

    go(async () => {
      const config = await this.client.Config.get()
      super.setState(config)
    })
  }

  override setState(state: IConfig): void {
    super.setState(state)

    this.client.Config.set(state)
  }
}

export const ConfigStoreContext = createStoreContext<IConfig>()
