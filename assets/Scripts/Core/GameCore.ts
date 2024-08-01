import { Game2048Location, LocationData, MaxRowAndCol, MoveDirection } from './GameDef';

export class GameCore {
    private map: Array<Array<number>>;
    private isChange: boolean;
    private score: number;
    private mergeArray: Array<number>;
    private temp: number;
    private emptyLocationList: Array<Game2048Location>;
    private beforeMoveMap: Array<Array<number>>;
    private isGameOver: boolean;
    private mergePositionArray: Array<Array<boolean>>;
    private movePositionArray:Array<Array<boolean>>;
    private tempMergeArray: Array<boolean>;
    private tempMoveArray:Array<boolean>;

    public get MergePositionArray() {
        return this.mergePositionArray;
    }

    public get MovePositionArray() {
        return this.movePositionArray;
    }

    public get IsChange() {
        return this.isChange;
    }
    public set IsChange(value: boolean) {
        this.isChange = value;
    }

    public get Map() {
        return this.map;
    }

    public get Score() {
        return this.score;
    }

    public get IsGameOver() {
        return this.isGameOver;
    }

    public constructor() {
        this.map = new Array<Array<number>>(MaxRowAndCol);
        this.mergeArray = new Array<number>(MaxRowAndCol);
        this.temp = 0;
        this.emptyLocationList = new Array<Game2048Location>(MaxRowAndCol * MaxRowAndCol);
        this.beforeMoveMap = new Array<Array<number>>(MaxRowAndCol);
        this.isChange = false;
        this.score = 0;
        this.isGameOver = false;
        this.mergePositionArray = new Array<Array<boolean>>(MaxRowAndCol);
        this.movePositionArray = new Array<Array<boolean>>(MaxRowAndCol);
        this.tempMergeArray = new Array<boolean>(MaxRowAndCol);
        this.tempMergeArray.fill(false);
        this.tempMoveArray = new Array<boolean>(MaxRowAndCol);
        this.tempMoveArray.fill(false);
        for (let i = 0; i < MaxRowAndCol; i++) {
            this.map[i] = new Array<number>(MaxRowAndCol);
            this.beforeMoveMap[i] = new Array<number>(MaxRowAndCol);
            this.mergePositionArray[i] = new Array<boolean>(MaxRowAndCol);
            this.movePositionArray[i] = new Array<boolean>(MaxRowAndCol);
            this.map[i].fill(0);
            this.beforeMoveMap[i].fill(0);
            this.mergePositionArray[i].fill(false);
            this.movePositionArray[i].fill(false);
        }
    }

    private removeZero() {
        for (let i = 0; i < this.mergeArray.length - 1; i++) {
            if (this.mergeArray[i] == 0) {
                for (let j = i + 1; j < this.mergeArray.length; j++) {
                    if (this.mergeArray[j] != 0) {
                        this.temp = this.mergeArray[i];
                        this.mergeArray[i] = this.mergeArray[j];
                        this.mergeArray[j] = this.temp;
                        this.tempMoveArray[j] = true;
                        break;
                    }
                }
            }
        }
    }


    //计分
    private mergeNumber() {
        this.tempMergeArray.fill(false);
        this.tempMoveArray.fill(false);
        this.removeZero();
        for (let i = 0; i < this.mergeArray.length - 1; i++) {
            if (this.mergeArray[i] != 0 && this.mergeArray[i] == this.mergeArray[i + 1]) {
                this.mergeArray[i] *= 2;
                //？？在二维数组中的位置需要播放动画
                this.tempMergeArray[i] = true;//该位置发生了合并

                this.mergeArray[i + 1] = 0;
                //统计合并位置
                this.score += this.mergeArray[i];
                //记录合并位置
            }
        }
        this.removeZero();
    }


    private upMove() {
        for(let i=0;i<MaxRowAndCol;i++){
            this.mergePositionArray[i].fill(false);
            this.movePositionArray[i].fill(false);
        }
        
        for (let c = 0; c < MaxRowAndCol; c++)   //遍历列
        {
            for (let r = 0; r < MaxRowAndCol; r++) {
                this.mergeArray[r] = this.map[r][c];
            }
            this.mergeNumber();
            for (let r = 0; r < MaxRowAndCol; r++) {
                this.map[r][c] = this.mergeArray[r];
                this.mergePositionArray[r][c] = this.tempMergeArray[r];
                this.movePositionArray[r][c] = this.tempMoveArray[r];
            }
        }

    }

    private downMove() {
        for(let i=0;i<MaxRowAndCol;i++){
            this.mergePositionArray[i].fill(false);
            this.movePositionArray[i].fill(false);
        }
        for (let c = 0; c < MaxRowAndCol; c++)   //遍历列
        {
            for (let r = 0; r < MaxRowAndCol; r++) {
                this.mergeArray[r] = this.map[MaxRowAndCol - r - 1][c];
            }
            this.mergeNumber();
            for (let r = 0; r < MaxRowAndCol; r++) {
                this.map[MaxRowAndCol - r - 1][c] = this.mergeArray[r];
                this.mergePositionArray[MaxRowAndCol - r - 1][c] = this.tempMergeArray[r];
                this.movePositionArray[MaxRowAndCol - r - 1][c] = this.tempMoveArray[r];
            }
        }
    }

    private leftMove() {
        for(let i=0;i<MaxRowAndCol;i++){
            this.mergePositionArray[i].fill(false);
            this.movePositionArray[i].fill(false);
        }
        for (let r = 0; r < MaxRowAndCol; r++)   //遍历行
        {
            for (let c = 0; c < MaxRowAndCol; c++) {
                this.mergeArray[c] = this.map[r][c];
            }
            this.mergeNumber();
            for (let c = 0; c < MaxRowAndCol; c++) {
                this.map[r][c] = this.mergeArray[c];
                this.mergePositionArray[r][c] = this.tempMergeArray[c];
                this.movePositionArray[r][c] = this.tempMoveArray[c];
            }
        }
    }

    private rightMove() {
        for(let i=0;i<MaxRowAndCol;i++){
            this.mergePositionArray[i].fill(false);
            this.movePositionArray[i].fill(false);
        }
        for (let r = 0; r < MaxRowAndCol; r++) {
            for (let c = 0; c < MaxRowAndCol; c++) {
                this.mergeArray[c] = this.map[r][MaxRowAndCol - c - 1];
            }

            this.mergeNumber();
            for (let c = 0; c < MaxRowAndCol; c++) {
                this.map[r][MaxRowAndCol - c - 1] = this.mergeArray[c];
                this.mergePositionArray[r][MaxRowAndCol - c - 1] = this.tempMergeArray[c];
                this.movePositionArray[r][MaxRowAndCol - c - 1] = this.tempMoveArray[c];
            }
        }
    }

    private checkChanged() {
        this.isChange = false;
        for (let i = 0; i < MaxRowAndCol; i++) {
            for (let j = 0; j < MaxRowAndCol; j++) {
                if (this.map[i][j] != this.beforeMoveMap[i][j])
                    this.isChange = true;
            }
        }
    }

    public move(moveDirection: MoveDirection) {
        for (let i = 0; i < MaxRowAndCol; i++) {
            for (let j = 0; j < MaxRowAndCol; j++) {
                this.beforeMoveMap[i][j] = this.map[i][j];
            }
        }
        switch (moveDirection) {
            case MoveDirection.Up:
                this.upMove();
                this.checkChanged();
                break;
            case MoveDirection.Down:
                this.downMove();
                this.checkChanged();
                break;
            case MoveDirection.Left:
                this.leftMove();
                this.checkChanged();
                break;
            case MoveDirection.Right:
                this.rightMove();
                this.checkChanged();
                break;
        }
    }

    //生成数字
    //随机在空白处生成数组,  2  90% 4  10%

    private calculateEmpty() {
        this.emptyLocationList.splice(0, this.emptyLocationList.length);
        for (let i = 0; i < MaxRowAndCol; i++) {
            for (let j = 0; j < MaxRowAndCol; j++) {
                if (this.map[i][j] == 0) {
                    let location: Game2048Location = {
                        rIndex: i,
                        cIndex: j,
                    }
                    this.emptyLocationList.push(location);
                }
            }
        }
    }

    public generateNumber() {
        this.calculateEmpty();
        let loctionData:LocationData = null;
        if (this.emptyLocationList.length > 0) {
            let randomNum = Math.round(Math.random() * this.emptyLocationList.length);
            let randomIndex = randomNum >= this.emptyLocationList.length ? 0 : randomNum;
            let loc = this.emptyLocationList[randomIndex];
            let number = this.map[loc.rIndex][loc.cIndex] = Math.random() * 10 <= 1 ? 4 : 2;
            loctionData = {
                location :loc,
                number:number,
            }
        }
        this.judgeGameOver();
        return loctionData;
    }


    //游戏结束
    //需求分析
    /* 
     * 移动(有可能某个方向无法合并了,产生了变)
     * 且生成数字
     * 生成数字后判断
     * 无空白，且不能再合并了
     */

    //相邻的都不相同
    private isMove() {
        for (let i = 0; i < MaxRowAndCol; i++) {
            for (let j = 0; j < MaxRowAndCol; j++) {
                if (i + 1 < MaxRowAndCol) {
                    if (this.map[i][j] == this.map[i + 1][j])
                        return true;
                }
                if (j + 1 < MaxRowAndCol) {
                    if (this.map[i][j] == this.map[i][j + 1])
                        return true;
                }
            }
        }
        return false;
    }

    private judgeGameOver() {
        this.calculateEmpty();
        if (this.emptyLocationList.length <= 0 && !this.isMove()) {
            this.isGameOver = true;
        }
    }
}


