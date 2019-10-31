/* global confirm */
/* eslint-disable no-alert, no-restricted-globals */

import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import MobileMenu from './MobileMenu.jsx';
import { useMenuOpen } from '../state/MenuOpenState.jsx';
import { displayError } from '../helpers/errors.js';

import {
  updateName,
  makePublic,
  makePrivate,
  remove,
} from '../../api/lists/methods.js';
import { insert } from '../../api/todos/methods.js';

const ListHeader = ({ list }) => {
  const [editing, setEditing] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);
  const menuOpen = useMenuOpen();

  useEffect(() => {
    setRedirectTo(null);
  }, [redirectTo]);

  const editList = () => {
    this.setState({ editing: true }, () => {
      this.listNameInput.focus();
    });
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const saveList = () => {
    setEditing(false);
    updateName.call({
      listId: list._id,
      newName: this.listNameInput.value,
    }, displayError);
  };

  const deleteList = () => {
    const message =
      `${i18n.__('components.listHeader.deleteConfirm')} ${list.name}?`;

    if (confirm(message)) {
      remove.call({ listId: list._id }, displayError);
      setRedirectTo('/');
    }
  };

  const onListFormSubmit = (event) => {
    event.preventDefault();
    saveList();
  };

  const onListInputKeyUp = (event) => {
    if (event.keyCode === 27) {
      cancelEdit();
    }
  };

  const onListInputBlur = () => {
    if (editing) {
      saveList();
    }
  };

  const toggleListPrivacy = () => {
    if (list.userId) {
      makePublic.call({ listId: list._id }, displayError);
    } else {
      makePrivate.call({ listId: list._id }, displayError);
    }
  };

  const onListDropdownAction = (event) => {
    if (event.target.value === 'delete') {
      deleteList();
    } else {
      toggleListPrivacy();
    }
  };

  const createTodo = (event) => {
    event.preventDefault();
    const input = this.newTodoInput;
    if (input.value.trim()) {
      insert.call({
        listId: list._id,
        text: input.value,
      }, displayError);
      input.value = '';
    }
  };

  const focusTodoInput = () => {
    this.newTodoInput.focus();
  };

  const renderDefaultHeader = () => (
    <div>
      <MobileMenu menuOpen={menuOpen} />
      <h1 className="title-page" onClick={editList}>
        <span className="title-wrapper">{list.name}</span>
        <span className="count-list">{list.incompleteCount}</span>
      </h1>
      <div className="nav-group right">
        <div className="nav-item options-mobile">
          <select
            className="list-edit"
            defaultValue="default"
            onChange={onListDropdownAction}
          >
            <option disabled value="default">
              {i18n.__('components.listHeader.selectAction')}
            </option>
            {list.userId ?
              <option value="public">
                {i18n.__('components.listHeader.makePublic')}
              </option> :
              <option value="private">
                {i18n.__('components.listHeader.makePrivate')}
              </option>}
            <option value="delete">
              {i18n.__('components.listHeader.delete')}
            </option>
          </select>
          <span className="icon-cog" />
        </div>
        <div className="options-web">
          <a className="nav-item" onClick={toggleListPrivacy}>
            {list.userId
              ? <span
                className="icon-lock"
                title={i18n.__('components.listHeader.makeListPublic')}
              />
              : <span
                className="icon-unlock"
                title={i18n.__('components.listHeader.makeListPrivate')}
              />}
          </a>
          <a className="nav-item trash" onClick={deleteList}>
            <span
              className="icon-trash"
              title={i18n.__('components.listHeader.deleteList')}
            />
          </a>
        </div>
      </div>
    </div>
  );

  const renderEditingHeader = () => (
    <form className="list-edit-form" onSubmit={onListFormSubmit}>
      <input
        type="text"
        name="name"
        autoComplete="off"
        ref={(c) => { this.listNameInput = c; }}
        defaultValue={list.name}
        onKeyUp={onListInputKeyUp}
        onBlur={onListInputBlur}
      />
      <div className="nav-group right">
        <a
          className="nav-item"
          onMouseDown={cancelEdit}
          onClick={cancelEdit}
        >
          <span
            className="icon-close"
            title={i18n.__('components.listHeader.cancel')}
          />
        </a>
      </div>
    </form>
  );

  return redirectTo
    ? <Redirect to={redirectTo} />
    : (
      <nav className="list-header">
        {editing ? renderEditingHeader() : renderDefaultHeader()}
        <form className="todo-new input-symbol" onSubmit={createTodo}>
          <input
            type="text"
            ref={(c) => { this.newTodoInput = c; }}
            placeholder={i18n.__('components.listHeader.typeToAdd')}
          />
          <span className="icon-add" onClick={focusTodoInput} />
        </form>
      </nav>
    );
};

ListHeader.propTypes = {
  list: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    userId: PropTypes.string,
    name: PropTypes.string.isRequired,
    incompleteCount: PropTypes.number.isRequired,
  }),
};

ListHeader.defaultProps = {
  list: {},
};

export default ListHeader;
