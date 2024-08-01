import { sys } from "cc";
import { CookieDef } from "./Core/GameDef";

export class CommonLibrary {
    static CheckInt(value) {
        if (value == null) {
            return 0;
        }
        let ret = parseInt(value);
        if (Number.isNaN(ret)) {
            ret = 0;
        }
        return ret;
    }

    static GetIntPersistenceData(cookie:CookieDef, defaultValue:number = 0){
        return CommonLibrary.CheckInt(sys.localStorage.getItem(cookie) || defaultValue);
    }
}


