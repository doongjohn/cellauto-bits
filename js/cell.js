class Cell {
  constructor(data) {
    // data is 8bit clamped (0-255)
    this.data = data;
    this.newData = data;
  }

  applyNewData() {
    this.data = this.newData;
  }
  calcNewDataRunner(num, ...others) {
    let result = this.data;
    for (const other of others) {
      result = this[`calc${num}`](this.data, result, other);
    }
    this.newData = result;
  }

  calc1(data, result, other) {
    // basic noise
    return result ^ other;
  }
  calc2(data, result, other) {
    const a = result ^ other;
    const b = ~result & ~other;
    return a ^ b;
  }
  calc3(data, result, other) {
    const a = result ^ other;
    const b = ~result | ~other;
    return a ^ b;
  }
  calc4(data, result, other) {
    const a = data;
    const b = Math.min(~result * other, 255);
    return a ^ b;
  }
  calc5(data, result, other) {
    const a = ~result;
    const b = Math.min(~result + other, 255);
    return a ^ b;
  }
  calc6(data, result, other) {
    // chaning full color
    const a = result >>> 1 ^ other >>> 1;
    const b = result << 1 ^ other << 1;
    return a ^ b;
  }
  calc7(data, result, other) {
    const a = other >>> 1;
    const b = other << 1;
    return a ^ b;
  }
  calc8(data, result, other) {
    const a = result | other >>> 1;
    const b = result | other << 1;
    return a ^ b;
  }
  calc9(data, result, other) {
    const a = ~result | other >>> 1;
    const b = result | other << 1;
    return a ^ b;
  }
  calc10(data, result, other) {
    // horizontal noise -> burn -> stable full light pink color
    const a = ~result ^ ~other >>> 1;
    const b = result | ~other << 1;
    return a ^ b;
  }
  calc11(data, result, other) {
    // flashing -> collapsing to center -> horizontal noise
    const a = ~data ^ ~other >>> 1;
    const b = result | ~other << 1;
    return a ^ b;
  }
  calc12(data, result, other) {
    // stable pink & yellow pattern
    const a = result | other >>> 1;
    const b = result & ~other << 1;
    return a ^ b;
  }
  calc13(data, result, other) {
    // stable light pink color pattern
    const a = result ^ other >>> 1;
    const b = result & ~other << 1;
    return a ^ b;
  }
  calc14(data, result, other) {
    // looping horizontal noise
    const a = result ^ other >>> 1;
    const b = result ^ ~other >>> 1;
    const c = result ^ ~other << 1;
    return a ^ b ^ c;
  }
  calc15(data, result, other) {
    // any color other than white
    const a = result ^ ~other >>> 1;
    const b = result ^ other << 1;
    return a ^ b;
  }
}