

export default function getAvatar(seed:string|number){
    return `https://api.dicebear.com/9.x/fun-emoji/png?rotate=350&radius=50&backgroundType=solid,gradientLinear&backgroundRotation=-360,-350,-340,-220&eyes=closed,cute,sleepClose,stars,wink,wink2,plain,shades,glasses,closed2&mouth=lilSmile,pissed,plain,shout,shy,sick,smileLol,smileTeeth,tongueOut,wideSmile,cute&seed=${seed}`;
}