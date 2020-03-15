import { createSelector } from 'reselect';

export const getTodos = createSelector(
    state => state.todos.list,
    state => state.users.list,
    (todos, users) => {
        if (todos === null || users === null) {
            return null;
        }
        return todos.map(todo => {
        const user = users.find(user => user.id === todo.user_id);
            return ({
                ...todo,
                userName: user ? user.name : '-'
            }
        )});
    }
);

export const getTodoLoadingError = state => state.todos.loadingError;
export const getTodoSaving = state => state.todos.saving;
export const getTodoSavingError = state => state.todos.savingError;
export const getTodoCreateFormDisplayed = state => state.todos.formDisplayed;
export const getTodoRemovedIds = state => state.todos.removedIds;
export const getTodoFormTitle = state => state.todos.formTitle;
export const getTodoFormUser = state => state.todos.formUser;
export const getTodoEditedId = state => state.todos.editedId;
export const getTodoFormEditMode = state => state.todos.editedId !== null;
