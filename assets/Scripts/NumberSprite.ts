import { _decorator, Component, Node, SpriteComponent, tween, Vec3, v3, resources, SpriteFrame, Prefab, instantiate, UIOpacity, UITransform } from 'cc';
import { MoveDirection } from './Core/GameDef';
const { ccclass, property } = _decorator;

@ccclass('NumberSprite')
export class NumberSprite extends Component {

    private sprite:SpriteComponent;

    @property(Prefab)
    private gridPrefab:Prefab = null;

    private animNode:Node = null;

    public async setImage(imgNumber:number)
    {
        if(this.sprite == null){
            this.sprite = this.node.getComponent(SpriteComponent);
        }
        //2->精灵->设置到Image中
        let path = "Sprites/2048Atlas_" + imgNumber + "/spriteFrame";
        this.sprite.spriteFrame = await this.loadSprite(path);
    }

    public loadSprite(path: string) {
        return new Promise<SpriteFrame>((resolve, reject) => {
            if (path == "") {
                reject("path is null");
                return;
            }
            resources.load(path, SpriteFrame, (err, sprite: SpriteFrame) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (sprite) {
                    resolve(sprite);
                    return;
                }
                reject(err);
                return;
            })
        });
    }

    //移动 合并 生成效果
    public createEffect()
    {
        //小->大        0->1
        tween(this.node).set({scale:Vec3.ZERO}).to(0.3,{scale:Vec3.ONE}, {easing:'backOut'}).start();
    }

    public createEffect2()
    {
        tween(this.node).set({scale:v3(1.2,1.2,1.2)}).to(0.3,{scale:Vec3.ONE},{easing:'backOut'}).start();
    }

    //移动动画
    public createEffect3(dir: MoveDirection) {
        if(!this.animNode){
            this.animNode = instantiate(this.gridPrefab);
            this.animNode.getComponent(NumberSprite).setImage(0);
            this.animNode.parent = this.node.parent.parent;
        }
        if(!this.animNode){
            return;
        }
        let curGlobal = this.node.parent.getComponent(UITransform).convertToWorldSpaceAR(this.node.position);
        let curPos = this.node.parent.parent.getComponent(UITransform).convertToNodeSpaceAR(curGlobal);
        let uiOp = this.animNode.getComponent(UIOpacity);
        switch (dir) {
            case MoveDirection.Up:
                tween(this.animNode).set({position:curPos}).to(0.3,{position:v3(curPos.x, curPos.y+5)},{easing:'backOut'}).start();
                break;
            case MoveDirection.Down:
                tween(this.animNode).set({position:curPos}).to(0.3,{position:v3(curPos.x, curPos.y-5)},{easing:'backOut'}).start();
                break;
            case MoveDirection.Left:
                tween(this.animNode).set({position:curPos}).to(0.3,{position:v3(curPos.x-5, curPos.y)},{easing:'backOut'}).start();
                break;
            case MoveDirection.Right:
                tween(this.animNode).set({position:curPos}).to(0.3,{position:v3(curPos.x+5, curPos.y)},{easing:'backOut'}).start();
                break;
        }
        tween(uiOp).set({opacity:255}).to(0.3,{opacity:0},{easing:'backOut'}).start();
    }
}
