import express, { type Request, type Response} from 'express'

const app = express();

app.get("/", (req: Request, res: Response) => {
  console.log(req);
  res.send("Hello World!");
});

app.listen(3000);
