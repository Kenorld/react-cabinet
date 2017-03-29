import { create } from 'mobx-persist'

const hydrate = create({
    //storage: localStorage // default localStorage
})

export default hydrate