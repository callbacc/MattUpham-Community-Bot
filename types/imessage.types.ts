
import { Message } from "discord.js";
import { ISettings } from "../models/settings.types";

export interface IMessage extends Message{
  settings: ISettings;
}