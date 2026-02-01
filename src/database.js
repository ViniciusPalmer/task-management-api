import fs from "node:fs/promises";

const DATABASE_PATH = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  #persist() {
    fs.writeFile(DATABASE_PATH, JSON.stringify(this.#database, null, 2));
  }

  constructor() {
    fs.readFile(DATABASE_PATH, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  select(table, search, id) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((item) => {
        return Object.entries(search).some(([key, value]) => {
          return item[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    if (id) {
      data = data.filter((item) => item.id === id);
    }

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((item) => item.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = data;
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((item) => item.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
