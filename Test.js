class Test {
  constructor(value = {}, param = {}) {
    for( let i in value ) this[i] = value[i];
    for( let i in param ) this[i] = param[i]

    if (!("stat" in this)) throw "no test without a stat!";

    this.stat = arrayify(this.stat);

    // this.randomize = true  // to randomize the test

    this.spec ??= [];
    this.spec = arrayify(this.spec);

    if ("name" in this)
      TESTS[this.name] = this;
  }
}
