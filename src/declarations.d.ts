declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_API_URL: string;
  }
}