import api from './api';

export default {
  findTodo() {
    return api().get('/findTodo');
  },
  findList(params) {
    return api().get(`/findList/${params}`);
  },
  completedList(params) {
    return api().put(`completedList/${params.idTodo}/${params.idList}`, params);
  },
  newTodo(params) {
    return api().post('/newTodo', params);
  },
  newList(params) {
    return api().post(`/newList/${params.id}`, params);
  },
  removedTodo(params) {
    return api().delete(`removedTodo/${params}`);
  },
  removedList(params) {
    return api().delete(`removedList/${params.idTodo}/${params.idList}`, params);
  },
};