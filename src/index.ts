import { aboutHandler, listAllUsers, updateUserProfile }  from "./about";
import * as authentication from "./authentication";
import finalhandler from "finalhandler";
import { createServer } from "http";
import { join } from 'path';
import { rootHandler}  from "./root";
// @ts-ignore
import Router from 'router';
import serveStatic from 'serve-static';

const router = Router();

// public フォルダを static ファイルとして提供する
router.use('/static', serveStatic(join(__dirname, "../public")));
router.get('/', rootHandler);

router.get('/about', listAllUsers);
router.get('/about/:user', aboutHandler);
router.post('/about/:user', updateUserProfile);

router.get('/login', authentication.loginPage);
router.post('/login', authentication.login);
router.get('/login/:token', authentication.claim);
router.get('/logout', authentication.logout);

// それ以外は 404 を返す
const server = createServer((req, res) => router(req, res, finalhandler(req, res)));

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
