/*
File: script.js
GUI Assignment 5: Implementing a Bit of Scrabble with Drag-and-Drop (with Extra Credits)
Masha Tsykora, UMass Lowell Computer Science, mary_tsykora@student.uml.edu
Copyright (c) 2023 by Masha Tsykora. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
Updated on 6/30/23 at 9:00pm.
Instructor: Professor Wenjin Zhou
Sources of Help: W3Schools, MDN Web Docs, CodingTheSmartway, C# Corner
Brief Overview: I created a Scrabble game that displays in the browser. There are a lot of 
issues with it, and it's not even close to complete. I've discussed this in more detail in 
my attached writeup.txt file, but I will give brief explanations for my code/functions in here.
*/

$(document).ready(function() {
    /* Here, I'm dynamically generating the grid that displays over my ScrabbleBoard.jpg image */
    var grid = '';
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            grid += '<div class="droppable"></div>';
        }
    }
    $('.scrabble-grid').html(grid);

    /* Here, I'm setting the first element of my 7x1 grid in the tile holder area to Scrabble_Tile_A */
    $('.grid .droppable:first-child').html('<img class="draggable" src="images/Scrabble_Tiles/Scrabble_Tile_A.jpg" alt="Source Image">');

    /* Here, I'm setting the second element of my 7x1 grid in the tile holder area to Scrabble_Tile_B */
    $('.grid .droppable:nth-child(2)').html('<img class="draggable" src="images/Scrabble_Tiles/Scrabble_Tile_B.jpg" alt="Source Image">');

    $(".draggable").draggable({
        revert: function(droppableObj) {
            var draggable = $(this);
            var droppable = droppableObj;

            /* Here, I tried to implement a way to detect if a tile is being dragged back to the tile holder grid area, 
            then I'll subtract the points from the score. Unfortunately, my score is stuck at zero. */
            if (droppable.hasClass('tile-holder')) {
                var value = calculateTileValue(draggable);
                score -= value;
                updateScore();
            }

            return !droppable.hasClass('tile-holder');
        },
        cursor: "move",
        start: function() {
            /* Here, I'm removing the green highlight that appears when my tiles are dragged anywhere (into any grid), 
            and it only gets applied when the tile is dropped into a grid square. */
            $(".droppable").removeClass("highlight");
        }
    });

    $(".droppable").droppable({
        accept: ".draggable",
        tolerance: "pointer",
        drop: function(event, ui) {
            var draggable = ui.draggable;
            var droppable = $(this);
            var droppableOffset = droppable.offset();
            var draggableOffset = draggable.offset();

            /* Here, I'm adjusting the tile position so that it's centered inside of any grid square */
            var adjustmentX = (droppable.width() - draggable.width()) / 2;
            var adjustmentY = (droppable.height() - draggable.height()) / 2;

            draggable.css({
                top: droppableOffset.top - draggableOffset.top + adjustmentY,
                left: droppableOffset.left - draggableOffset.left + adjustmentX
            });

            draggable.detach().appendTo(droppable);
            droppable.addClass("highlight");

            /* Here, I'm trying to implement a variable to calculate my running score */
            var value = calculateTileValue(draggable);

            /* Here, I made a custom event that tells me the value of the dropped tile */
            var event = new CustomEvent("tileDropped", { detail: { value: value } });
            document.dispatchEvent(event);

            /* Here, I'm ONLY updating the score when I drag a tile from the tile holder grid area to the scrabble board grid */
            if (draggable.parent().hasClass("tile-holder")) {
                score -= value;
            } else if (droppable.hasClass("tile-holder")) {
                score += value;
            }

            updateScore();
        }
    });

    /* I had a lot of issues with implementing the score and various other aspects of this javascript code, I'll talk more about 
    this in my writeup.txt file */
    var score = 0;
    var scoreElement = document.getElementById("score");

    function updateScore() {
        scoreElement.textContent = "Score: " + score;
    }

    updateScore();
});
