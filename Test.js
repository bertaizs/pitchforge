class Test {
  constructor(value = {}, param = {}) {
    for (let i in value) this[i] = value[i];

    if (!("stat" in this)) throw "test without a stat!";

    this.stat = arrayify(this.stat);

    this.spec ??= [];
    this.spec = arrayify(this.spec);

    if ("name" in this)
      TESTS[this.name] = this;
  }
}
