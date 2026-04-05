import { ws } from "msw";
import { WS_URL } from "../Consts";

const mockWs = ws.link(WS_URL);

const defaultFace = {
  left: 152,
  right: 289,
  top: 178,
  bottom: 316,
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

const secondFace = {
  left: 452,
  right: 489,
  top: 378,
  bottom: 516,
  geometry: {
    chin: [
      [77, 161],
      [80, 187],
      [86, 213],
      [91, 237],
      [100, 261],
      [113, 283],
      [131, 301],
      [152, 316],
      [177, 322],
      [204, 321],
      [228, 309],
      [250, 292],
      [265, 270],
      [276, 243],
      [280, 215],
      [282, 185],
      [282, 156],
    ],
    left_eyebrow: [
      [93, 137],
      [102, 122],
      [120, 117],
      [138, 119],
      [156, 123],
    ],
    right_eyebrow: [
      [187, 123],
      [206, 116],
      [226, 115],
      [245, 120],
      [256, 135],
    ],
    nose_bridge: [
      [172, 144],
      [172, 163],
      [171, 182],
      [171, 202],
    ],
    nose_tip: [
      [155, 216],
      [163, 221],
      [174, 224],
      [186, 221],
      [196, 216],
    ],
    left_eye: [
      [115, 150],
      [125, 144],
      [137, 143],
      [148, 150],
      [137, 153],
      [125, 155],
    ],
    right_eye: [
      [202, 150],
      [215, 144],
      [226, 144],
      [239, 150],
      [228, 155],
      [215, 153],
    ],
    top_lip: [
      [143, 256],
      [155, 250],
      [167, 247],
      [177, 249],
      [187, 246],
      [201, 250],
      [217, 256],
      [211, 256],
      [187, 255],
      [177, 256],
      [167, 256],
      [148, 258],
    ],
    bottom_lip: [
      [217, 256],
      [204, 267],
      [189, 270],
      [179, 270],
      [167, 270],
      [155, 265],
      [143, 256],
      [148, 258],
      [167, 256],
      [177, 256],
      [189, 256],
      [211, 256],
    ],
  },
};
const thirdFace = window.structuredClone(secondFace);
thirdFace.left = 50;
thirdFace.top = 100;
const fourthFace = {
  left: 52,
  right: 489,
  top: 778,
  bottom: 516,
  geometry: {
    chin: [
      [53, 111],
      [55, 130],
      [59, 147],
      [63, 164],
      [69, 180],
      [78, 196],
      [90, 208],
      [105, 219],
      [122, 223],
      [141, 222],
      [157, 214],
      [173, 202],
      [184, 187],
      [191, 168],
      [194, 148],
      [195, 128],
      [195, 108],
    ],
    left_eyebrow: [
      [64, 94],
      [71, 84],
      [83, 81],
      [95, 82],
      [108, 85],
    ],
    right_eyebrow: [
      [130, 85],
      [142, 80],
      [157, 79],
      [169, 83],
      [177, 94],
    ],
    nose_bridge: [
      [119, 100],
      [119, 113],
      [118, 126],
      [118, 140],
    ],
    nose_tip: [
      [107, 149],
      [113, 153],
      [121, 155],
      [129, 153],
      [136, 149],
    ],
    left_eye: [
      [79, 104],
      [86, 100],
      [94, 99],
      [103, 104],
      [94, 106],
      [86, 107],
    ],
    right_eye: [
      [140, 104],
      [148, 100],
      [157, 100],
      [165, 104],
      [157, 107],
      [148, 106],
    ],
    top_lip: [
      [99, 177],
      [107, 173],
      [115, 171],
      [122, 172],
      [130, 170],
      [139, 173],
      [150, 177],
      [146, 177],
      [130, 176],
      [122, 177],
      [115, 177],
      [103, 178],
    ],
    bottom_lip: [
      [150, 177],
      [141, 184],
      [131, 187],
      [124, 187],
      [115, 187],
      [107, 184],
      [99, 177],
      [103, 178],
      [115, 177],
      [122, 177],
      [131, 177],
      [146, 177],
    ],
  },
};

const fakeCamera = {
  status: "running",
  cameras: [
    {
      faces: {
        abc: defaultFace,
        def: secondFace,
        ghi: thirdFace,
      },
      width: 1080,
      height: 1920,
    },
  ],
};

let count = 0;

export const handlers = [
  mockWs.addEventListener("connection", ({ client }) => {
    console.log("MSW is on and listening");
    client.addEventListener("message", () => {
      count += 1;
      for (const faceKey of Object.keys(fakeCamera.cameras[0].faces)) {
        let updatedFace = fakeCamera.cameras[0].faces[faceKey];
        updatedFace = translate(updatedFace, faceKey);
        if (count % 5 == 0) {
          updatedFace = transform(updatedFace);
        }
        fakeCamera.cameras[0].faces[faceKey] = updatedFace;
        client.send(JSON.stringify(fakeCamera));
        if (count == 50) {
          count = 0;
          getFreshFace();
        }
      }
    });
  }),
];
function translate(updatedFace, faceKey) {
  const dimension = Math.random() > 0.5 ? ["top", "bottom"] : ["left", "right"];
  const direction = Math.random() > 0.5 ? 1 : -1;
  updatedFace[dimension[0]] =
    fakeCamera.cameras[0].faces[faceKey][dimension[0]] + 2 * direction;
  updatedFace[dimension[1]] =
    fakeCamera.cameras[0].faces[faceKey][dimension[1]] + 2 * direction;

  return updatedFace;
}

function transform(updatedFace) {
  for (const part of Object.keys(updatedFace.geometry)) {
    const index = Math.floor(Math.random() * updatedFace.geometry[part].length);
    const point = updatedFace.geometry[part][index];

    const direction = Math.random() > 0.5 ? 1 : -1;
    point[0] = point[0] + 2 * direction;
    point[1] = point[1] + 2 * direction;
  }
  return updatedFace;
}

function getFreshFace() {
  fakeCamera.cameras[0].faces["abc"] = window.structuredClone(defaultFace);
  fakeCamera.cameras[0].faces["def"] = window.structuredClone(secondFace);
  fakeCamera.cameras[0].faces["ghi"] = window.structuredClone(thirdFace);
  fakeCamera.cameras[0].faces["jkl"] = window.structuredClone(fourthFace);
}
