import { autorun, extendObservable, observable} from 'mobx'

class Todo {
    id = Math.random();
    @observable aaa = 111;
    @observable bbb = 222;
}

window.testStore = new Todo();
window.store = observable({
    title: 'front end developer',
   });
autorun(function () {
    console.log( window.testStore.aaa + " " + window.testStore.bbb + " " +  window.testStore.aaa );
    debugger;
})


