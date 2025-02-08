import "./ColorPicker.css";

const COLORS = [
  // Reds
  ["#ffcdd2", "#e57373", "#c62828"],
  // Pinks
  ["#f8bbd0", "#f06292", "#c2185b"],
  // Purples
  ["#e1bee7", "#ba68c8", "#7b1fa2"],
  // Deep Purples
  ["#d1c4e9", "#9575cd", "#512da8"],
  // Blues
  ["#bbdefb", "#64b5f6", "#1976d2"],
  // Teals
  ["#b2dfdb", "#4db6ac", "#00796b"],
  // Greens
  ["#c8e6c9", "#81c784", "#388e3c"],
  // Yellows
  ["#fff9c4", "#fff176", "#f9a825"],
  // Oranges
  ["#ffe0b2", "#ffb74d", "#ef6c00"],
  // Browns
  ["#d7ccc8", "#a1887f", "#5d4037"],
  // Grayscale
  ["#ffffff", "#9e9e9e", "#212121"],
];

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  selectedColor: string;
  onReset: () => void;
}

export const ColorPicker = ({
  onColorSelect,
  selectedColor,
  onReset,
}: ColorPickerProps) => {
  return (
    <div className="color-picker">
      <div className="color-grid">
        {COLORS.map((variations, rowIndex) => (
          <div key={rowIndex} className="color-column">
            {variations.map((color, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`color-button ${
                  color === selectedColor ? "selected" : ""
                }`}
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => onColorSelect(color)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="reset-grid">
        <button className="preset-button" onClick={onReset}>
          reset
        </button>
      </div>
    </div>
  );
};
