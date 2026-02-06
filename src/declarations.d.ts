declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

declare const process: {
  env: {
    REACT_APP_API_URL: string;
  };
};
