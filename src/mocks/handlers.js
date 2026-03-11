import { ws, http, HttpResponse } from "msw";
import { WS_URL } from "../Consts";

const mockWs = ws.link(WS_URL);

const fakeCamera = {
  status: "running",
  cameras: {
    camera0: {
      faces: {
        abc: {
          chin: [
            (52, 108),
            (54, 126),
            (58, 143),
            (61, 159),
            (67, 175),
            (76, 190),
            (88, 202),
            (102, 212),
            (119, 216),
            (137, 215),
            (153, 207),
            (168, 196),
            (178, 181),
            (185, 163),
            (188, 144),
            (189, 124),
            (189, 105),
          ],
          left_eyebrow: [(63, 92), (69, 82), (81, 79), (93, 80), (105, 83)],
          right_eyebrow: [
            (126, 83),
            (138, 78),
            (152, 77),
            (164, 81),
            (172, 91),
          ],
          nose_bridge: [(116, 97), (116, 110), (115, 122), (115, 136)],
          nose_tip: [
            (104, 145),
            (110, 148),
            (117, 150),
            (125, 148),
            (132, 145),
          ],
          left_eye: [
            (77, 101),
            (84, 97),
            (92, 96),
            (100, 101),
            (92, 103),
            (84, 104),
          ],
          right_eye: [
            (136, 101),
            (144, 97),
            (152, 97),
            (160, 101),
            (153, 104),
            (144, 103),
          ],
          top_lip: [
            (96, 172),
            (104, 168),
            (112, 166),
            (119, 167),
            (126, 165),
            (135, 168),
            (146, 172),
            (142, 172),
            (126, 171),
            (119, 172),
            (112, 172),
            (100, 173),
          ],
          bottom_lip: [
            (146, 172),
            (137, 179),
            (127, 181),
            (120, 181),
            (112, 181),
            (104, 178),
            (96, 172),
            (100, 173),
            (112, 172),
            (119, 172),
            (127, 172),
            (142, 172),
          ],
        },
      },
      width: 1080,
      height: 1920,
    },
  },
};

export const handlers = [
  mockWs.addEventListener("connection", ({ client }) => {
    console.log("successfully intercepted websocket");
    client.addEventListener("message", (event) => {
      return HttpResponse.json({ fakeCamera });
    });
  }),
];
