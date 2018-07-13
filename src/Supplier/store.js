
import { types} from "mobx-state-tree"

const Supplier = types.model('Supplier', { // B
    id: types.string,
    name: types.string,
    phone: types.string
})
const SupplierStore = types.model('suppliers', { // C
        suppliers: types.array(Supplier)
    })
    .actions(self => ({ // A
        addNew(supplier) {
          self.suppliers.push(supplier)
        }
    }))
    .create({ // D
        suppliers: [{
            id: "1",
            name: "小张",
            phone: "123232323"
        }]
    })

export default SupplierStore