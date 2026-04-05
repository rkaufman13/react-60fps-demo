const faceToShrink = {
  geometry: {
    chin: [
      [119, 248],
      [124, 289],
      [133, 328],
      [140, 365],
      [154, 402],
      [174, 436],
      [202, 464],
      [234, 487],
      [273, 496],
      [315, 494],
      [351, 476],
      [386, 450],
      [409, 416],
      [425, 374],
      [432, 331],
      [434, 285],
      [434, 241],
    ],
    left_eyebrow: [
      [144, 211],
      [158, 188],
      [186, 181],
      [213, 184],
      [241, 190],
    ],
    right_eyebrow: [
      [289, 190],
      [317, 179],
      [349, 177],
      [377, 186],
      [395, 209],
    ],
    nose_bridge: [
      [266, 223],
      [266, 252],
      [264, 280],
      [264, 312],
    ],
    nose_tip: [
      [239, 333],
      [252, 340],
      [269, 345],
      [287, 340],
      [303, 333],
    ],
    left_eye: [
      [177, 232],
      [193, 223],
      [211, 220],
      [229, 232],
      [211, 236],
      [193, 239],
    ],
    right_eye: [
      [312, 232],
      [331, 223],
      [349, 223],
      [368, 232],
      [351, 239],
      [331, 236],
    ],
    top_lip: [
      [220, 395],
      [239, 386],
      [257, 381],
      [273, 384],
      [289, 379],
      [310, 386],
      [335, 395],
      [326, 395],
      [289, 393],
      [273, 395],
      [257, 395],
      [229, 397],
    ],
    bottom_lip: [
      [335, 395],
      [315, 411],
      [292, 416],
      [276, 416],
      [257, 416],
      [239, 409],
      [220, 395],
      [229, 397],
      [257, 395],
      [273, 395],
      [292, 395],
      [326, 395],
    ],
  },
};

for (const part of Object.keys(faceToShrink.geometry)) {
  for (const points in faceToShrink.geometry[part]) {
    const newPoint0 = Math.floor(faceToShrink.geometry[part][points][0] * 0.45);
    const newPoint1 = Math.floor(faceToShrink.geometry[part][points][1] * 0.45);
    faceToShrink.geometry[part][points] = [newPoint0, newPoint1];
  }
}

console.log(JSON.stringify(faceToShrink));
