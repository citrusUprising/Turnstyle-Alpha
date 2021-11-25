class Preload extends Phaser.Scene
{
    constructor() {
        super("preloadScene");
    }

    preload ()
    {   

        this.load.image("pentagon", "./assets/ui/pentagon.png");
        this.load.image("pentagon cover", "./assets/ui/pentagon_cover.png");
        this.load.image("text box", "./assets/ui/text_box.png");
        this.load.image("arrow", "./assets/ui/arrow.png");
        this.load.image("check", "./assets/ui/check.png");
        this.load.image("total speed", "./assets/ui/total_speed.png");
        this.load.image("small arrow", "./assets/ui/small_arrow.png");
        this.load.image("square", "./assets/ui/square_character.png");

        this.load.image("circle", "./assets/ui/circle_character.png");
        this.load.image("triangle", "./assets/ui/triangle_character.png");
        this.load.image("square", "./assets/ui/square_character.png");
        this.load.image("hexagon", "./assets/ui/hexagon_character.png");
        this.load.image("star", "./assets/ui/star_character.png");


        this.createProgressbar(game.config.width / 2, game.config.height / 2);
    }

    createProgressbar (x, y)
    {
        // size & position
        let width = 400;
        let height = 20;
        let xStart = x - width / 2;
        let yStart = y - height / 2;

        // border size
        let borderOffset = 2;

        let borderRect = new Phaser.Geom.Rectangle(
            xStart - borderOffset,
            yStart - borderOffset,
            width + borderOffset * 2,
            height + borderOffset * 2);

        let border = this.add.graphics({
            lineStyle: {
                width: 5,
                color: 0xaaaaaa
            }
        });
        border.strokeRectShape(borderRect);

        let progressbar = this.add.graphics();

        /**
         * Updates the progress bar.
         * 
         * @param {number} percentage 
         */
        let updateProgressbar = function (percentage)
        {
            progressbar.clear();
            progressbar.fillStyle(0xffffff, 1);
            progressbar.fillRect(xStart, yStart, percentage * width, height);
        };

        this.load.on('progress', updateProgressbar);

        this.load.once('complete', function ()
        {

            this.load.off('progress', updateProgressbar);
            this.scene.start('playScene');

        }, this);
    }
}