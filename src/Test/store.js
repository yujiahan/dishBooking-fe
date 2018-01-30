import { observable, computed, action, runInAction } from 'mobx'

class TestStore {
    page = 1;
    pageEntry = '';
    @observable noMore = false;
}
const testStore = new TestStore();
export default testStore