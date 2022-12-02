import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import classNames from "classnames";
import styles from "../App.module.css";
const cx = classNames.bind(styles);

const defaultListObj = {
  id: 0,
  description: "dummy text",
  enable: false,
  checked: false,
};

let localPostsList = [];

export default function TodoList() {
  const initList = () => {
    const localMemories = localStorage.getItem("todolist");
    if (localMemories.length) {
      return JSON.parse(localMemories);
    }

    const defaultList = [];
    let newItem = { ...defaultListObj };
    for (let i = 0; i < 2; i++) {
      newItem[i].id = i;
      newItem[i].description = `dummy test${i}`;
      defaultList.push(newItem);
    }

    return defaultList;
  };

  const input = useRef(null);
  const editArea = useRef(null);
  const editBtn = useRef(null);
  const [getPosts, setPosts] = useState(initList());
  const [getFilteredPosts, setFilteredPosts] = useState([]);
  const [getDark, setDark] = useState(true);
  const [getEnable, setEnable] = useState(false);
  const [getCheckedItems, setCheckedItems] = useState([]);
  const [getStatus, setStatus] = useState("all");

  const createItem = () => {
    const txt = input.current.value.trim();
    if (!txt.length) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      let newItem = {
        ...defaultListObj,
        id: getPosts.length ? getPosts.at(-1).id + 1 : 1,
        description: txt,
      };
      localPostsList = [...localPostsList, newItem];
      changeFilterPosts(getStatus);
    } catch {
      console.error("리스트 생성중 에러가 발생하였습니다.");
    } finally {
      input.current.value = "";
    }
  };

  const setEnableMode = (target_idx) => {
    setEnable(true);

    let posts = [...getPosts];
    posts[target_idx].Enable = true;
    setPosts(posts);
  };

  const deleteItem = (target_idx) => {
    if (!target_idx < 0) return;

    setPosts(getPosts.filter((_, idx) => idx !== target_idx));
  };

  const editItem = (target_idx, e) => {
    if (!getEnable) {
      setEnableMode(target_idx);
    } else {
      const target_item_idx = getPosts.indexOf(
        getPosts.find((item) => item.Enable === true)
      );

      if (target_item_idx !== target_idx) return;
      setEnable(false);
      const editTxt = editArea.current.value.trim();
      if (!editTxt.length) {
        alert("수정할 내용을 입력해주세요.");
        return;
      }

      let posts = [...getPosts];
      posts[target_idx].Enable = false;
      posts[target_idx].description = editTxt;
      setPosts(posts);
    }
  };

  const checkHandler = (idx, isChecked) => {
    let posts = [...getPosts];
    posts[idx].checked = isChecked;
    setPosts(posts);
    changeFilterPosts(getStatus);
  };

  const changeFilterPosts = (status) => {
    setStatus(status);
    let filtering = [];
    console.log(status);
    if (status === "unChecked") {
      filtering = localPostsList.filter((item) => item.checked === false);
    } else if (status === "checked") {
      filtering = localPostsList.filter((item) => item.checked === true);
    } else if (status === "all") {
      filtering = [...localPostsList];
    }

    setPosts(filtering);
  };

  useEffect(() => {
    localPostsList = [...getPosts];
  }, []);

  useEffect(() => {
    localStorage.setItem("todolist", JSON.stringify(getPosts));
  }, [getPosts, getCheckedItems, getFilteredPosts]);

  return (
    <div className={classNames(styles.wrapper, getDark ? "" : styles.dark)}>
      <header className={classNames(styles.header, styles.flex_center)}>
        <div>
          <span
            className={styles.darkmodeBtn}
            onClick={() => {
              setDark((prev) => !prev);
            }}
          >
            {getDark ? "🌙" : "🌞"}
          </span>
        </div>
        <ul className={classNames(styles.flex_start, styles.btn_wrapper)}>
          <li onClick={() => changeFilterPosts("all")}>All</li>
          <li onClick={() => changeFilterPosts("unChecked")}>Active</li>
          <li onClick={() => changeFilterPosts("checked")}>Completed</li>
        </ul>
      </header>
      <ul className={styles.checkList}>
        {getPosts.map((item, idx) => {
          return (
            <li key={idx} className={styles.item}>
              <div>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    checkHandler(idx, e.target.checked);
                  }}
                  checked={item.checked}
                />
                {!item.Enable ? (
                  <span>{item.description}</span>
                ) : (
                  <input
                    type="text"
                    placeholder="할일을 입력해주세요."
                    ref={editArea}
                    defaultValue={item.description}
                    className={styles.editInput}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        editItem(idx, e);
                      }
                    }}
                  />
                )}
              </div>
              <div className={styles.btns}>
                <span onClick={(e) => editItem(idx, e)} ref={editBtn}>
                  {item.Enable ? "save🎈" : "edit🩹"}
                </span>
                <span onClick={() => deleteItem(idx)}>Delete💣</span>
              </div>
            </li>
          );
        })}
      </ul>
      <footer className={styles.footer}>
        <input
          type="text"
          placeholder="Add Todo"
          ref={input}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              createItem();
            }
          }}
        />
        <button onClick={() => createItem()}>Add</button>
      </footer>
    </div>
  );
}
