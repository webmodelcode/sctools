import { storage } from "#imports";
import { GLOBAL_STINGS } from "~@/presentation/config";

const STORAGE_KEY = GLOBAL_STINGS.QUICK_MESSAGES_KEY;

const quickMessageStorage = storage.defineItem<boolean>(
  "local:quickMenuIsActive",
  {
    fallback: true,
  }
);
