import * as uuid from "uuid";

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callBack: Function) => {
  if (!file) return callBack(new Error("El archivo es requerido"), false);

  const fileExtension = file.mimetype.split("/")[1];

  const fileName = `${uuid.v4()}.${fileExtension}`;

  callBack(null, fileName);
};
