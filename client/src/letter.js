export class Letter {
  static DEFAULT_SW = 3;
  constructor(pos, letter, r = 20) {
    this.pos = pos;
    this.r = r;
    this.letter = letter;
    this.sw = Letter.DEFAULT_SW;
  }

  draw(ctx) {
    ctx.save();
    // Draw the circle at the vertex first
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI); // Draw the circle at the position
    ctx.strokeStyle = "#30bfa5"; // Circle color
    ctx.lineWidth = this.sw; // Set stroke width
    ctx.stroke(); // Stroke the circle outline
    ctx.fillStyle = "#ffffff"; // Set fill color to white for the circle
    ctx.fill(); // Fill the circle

    // Now, draw the text inside the circle
    ctx.fillStyle = "#30bfa5"; // Text color
    ctx.font = "bold 20px Arial"; // Set the font to bold
    ctx.textAlign = "center"; // Align text to the center horizontally
    ctx.textBaseline = "middle"; // Align text to the center vertically
    ctx.fillText(this.letter.toUpperCase(), this.pos.x, this.pos.y); // Place the text at the center of the circle
    ctx.restore();
  }
}
