
exports.floatToInt16 = floatToInt16;
exports.unsignedFloatToInt16 = unsignedFloatToInt16;
exports.int16ToFloat = int16ToFloat;
exports.int16ToUnsignedFloat = int16ToUnsignedFloat;

function floatToInt16 (f, divider) {
	f = Math.max(-0.5, Math.min(0.5, f / divider)) + 0.5;
	let rx = (f * 256) % 1;
	let ry = f % 1;
	ry -= rx * 1.0 / 256.0;
	rx *= 256.0;
	ry *= 256.0;
	return Math.floor(ry * 256) + Math.floor(rx);
  }
  
function unsignedFloatToInt16 (f, divider) {
	f = Math.max(0, Math.min(1, f / divider));
	let rx = (f * 256) % 1;
	let ry = f % 1;
	ry -= rx * 1.0 / 256.0;
	rx *= 256.0;
	ry *= 256.0;
	return Math.floor(ry * 256) + Math.floor(rx);
  }
  
  function int16ToFloat (int16, divider) {
	return (int16 / 65535 - 0.5) * divider;
  }
  
  function int16ToUnsignedFloat (int16, divider) {
	return int16 / 65535 * divider;
  }