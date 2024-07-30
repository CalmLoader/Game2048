import { _decorator, Component, Node, Label, AudioSourceComponent, SpriteComponent, Vec2, AudioClip, input, Input, EventTouch } from 'cc';
import { GameCore } from './Core/GameCore';
import { Game2048Location, MaxRowAndCol, MoveDirection } from './Core/GameDef';
import { NumberSprite } from './NumberSprite';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {

    private core: GameCore;
    private numberSprites: Array<Array<NumberSprite>>;

    @property(Label)
    public scoreText: Label = null;
    @property(Label)
    public maxScoreText: Label = null;
    @property(AudioSourceComponent)
    private audioSource: AudioSourceComponent;

    @property(Array<AudioClip>)
    public clips: Array<AudioClip> = new Array<AudioClip>(4);

    private isMerge: boolean = false;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }


    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    start() {
        this.core = new GameCore();
        this.numberSprites = new Array<Array<NumberSprite>>(MaxRowAndCol);
        this.init();
        this.generateNewNumber();
        this.generateNewNumber();
        this.scoreText.string = "0";
        this.maxScoreText.string = "0";
        this.audioSource = this.node.getComponent(AudioSourceComponent);
        for (let i = 0; i < MaxRowAndCol; i++) {
            this.numberSprites[i] = new Array<NumberSprite>(MaxRowAndCol);
        }
    }

    update(deltaTime: number) {
        if (this.core.IsChange) {
            //更新界面
            this.updateMap();
            //产生新数字
            this.generateNewNumber();

            //移动效果

            //判断游戏是否结束
            if (this.core.IsGameOver) {
            }
            this.core.IsChange = false;
        }
    }

    private init() {
        for (let i = 0; i < MaxRowAndCol; i++) {
            for (let j = 0; j < MaxRowAndCol; j++) {
                this.createSprite(i, j);
            }
        }
    }

    //创建一个精灵
    private createSprite(r: number, c: number) {
        let node = new Node(r.toString() + c.toString());
        node.addComponent(SpriteComponent);
        let action: NumberSprite = node.addComponent(NumberSprite);  //Onload立即执行   Start下一帧执行
        this.numberSprites[r][c] = action;
        action.setImage(0);
        node.parent = this.node;
    }

    private generateNewNumber(): void {
        //位置?
        //数字?

        let locationData = this.core.generateNumber();

        if (locationData != null) {
            let loc: Game2048Location = locationData.location;
            let number: number = locationData.number;
            //根据精灵行为引用进行设置
            this.numberSprites[loc.rIndex][loc.cIndex].setImage(number);
            this.numberSprites[loc.rIndex][loc.cIndex].createEffect();
        }
    }

    private updateMap() {
        this.isMerge = false;
        for (let i = 0; i < MaxRowAndCol; i++) {
            for (let j = 0; j < MaxRowAndCol; j++) {
                this.numberSprites[i][j].setImage(this.core.Map[i][j]);
                //合并效果
                if (this.core.MergePositionArray[i][j]) {
                    this.numberSprites[i][j].createEffect2();
                    this.isMerge = true;
                }

            }
        }
        if (this.isMerge) {
            this.scoreText.string = this.core.Score.toString();
            this.audioSource.playOneShot(this.clips[1]);
        }
    }


    private isDown: boolean = false;
    private offset: Vec2;
    private startPoint: Vec2;
    onTouchStart(event: EventTouch) {
        this.startPoint = event.getLocation();
        this.isDown = true;
    }

    onTouchMove(event: EventTouch) {
        if (this.isDown == false)
            return;

        let currentPos: Vec2 = event.getLocation();
        this.offset = currentPos.subtract(this.startPoint);
        let x: number = Math.abs(this.offset.x);
        let y: number = Math.abs(this.offset.y);

        let dir: MoveDirection = null;

        if (x > y && x >= 50) {
            dir = this.offset.x > 0 ? MoveDirection.Right : MoveDirection.Left;
        }

        if (y > x && y >= 50) {
            dir = this.offset.y > 0 ? MoveDirection.Up : MoveDirection.Down;
        }
        if (dir != null) {
            this.core.move(dir);
            this.audioSource.playOneShot(this.clips[0]);
            this.isDown = false;
        }
    }

    onTouchEnd(event: EventTouch) {
        this.isDown = false;
    }
}


