import { observable} from 'mobx'

class TestStore {
    page = 1;
    pageEntry = '';
    @observable noMore = 'sdf';
}
const testStore = new TestStore();
export default testStore