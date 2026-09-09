export default (buffer: Buffer): boolean =>
  buffer.length >= 3
  && buffer[0] === 0xff
  && buffer[1] === 0xd8
  && buffer[2] === 0xff;
