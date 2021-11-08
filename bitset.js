// Bit storage logic
const BITS_PER_BYTE = 8;
const BYTES_PER_WORD = 4;  // assuming 32-bit
const BITS_PER_WORD = BYTES_PER_WORD * BITS_PER_BYTE;

function get_word_offset(pos) { 
  return (pos / BITS_PER_WORD) | 0;
}

function get_bit_offset(pos) {
  return pos % BITS_PER_WORD;
}

function get_bitmask(pos) {
  return 1 << get_bit_offset(pos);
}

/** set, clear, flip bits over an array of 32-bit ints
*  bits are 0-indexed.
**/
class BitSet {
  constructor(num_bits) {
    let words = Math.ceil(num_bits / 32) | 0;
    this.num_bits = words * BITS_PER_WORD;
    this.bits = new Uint32Array(words);
  }
  
  /** returns true if ith bit is set, else false */
  test(i) {
    return (this.bits[get_word_offset(i)] & get_bitmask(i)) != 0;
  }
  
  /** sets the ith bit. */
  set(i) {
    let idx = get_word_offset(i);
    let prior = this.bits[idx];
    let bitmask = get_bitmask(i);
    this.bits[idx] |= bitmask;
  }
  
  /** clears the ith bit */
  clear(i) {
    let idx = get_word_offset(i);
    let prior = this.bits[idx];
    let bitmask = get_bitmask(i);
    this.bits[idx] &= ~bitmask;
  }
  
  /** flips the value of the ith bit */
  flip(i) {
    this.bits[get_word_offset(i)] ^= get_bitmask(i)
  }
  
  clearAll() {
    this.bits.fill(0)
  }
  
  copyBits(other) {
    for (let i = 0; i < other.bits.length; ++i) {
      this.bits[i] = other.bits[i]
    }
  }
  
  print() {
    // LOL SHITTY CODE
    let buf = [];
    for (let i = 0; i < this.num_bits; ++i) {
      buf.push(this.test(i) ? "1" : "0");
    }
    console.log(buf.join(""))
  }
  
}