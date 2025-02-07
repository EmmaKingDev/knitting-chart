import { useState } from "react";
import { ColorPicker } from "./ColorPicker";
import "./KnittingGrid.css";

interface GridCell {
  color: string;
}

export const KnittingGrid = () => {
  const [gridWidth, setGridWidth] = useState(60);
  const [gridHeight, setGridHeight] = useState(40);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [gridCells, setGridCells] = useState<GridCell[][]>(() =>
    Array(40)
      .fill(null)
      .map(() => Array(60).fill({ color: "white" }))
  );

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const newWidth = Math.max(1, Math.min(value, 60));
      setGridWidth(newWidth);
      setGridCells((prev) =>
        prev.map((row) => {
          if (newWidth > row.length) {
            return [
              ...row,
              ...Array(newWidth - row.length).fill({ color: "white" }),
            ];
          }
          return row.slice(0, newWidth);
        })
      );
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const newHeight = Math.max(1, Math.min(value, 40));
      setGridHeight(newHeight);
      setGridCells((prev) => {
        if (newHeight > prev.length) {
          const newRows = Array(newHeight - prev.length)
            .fill(null)
            .map(() => Array(gridWidth).fill({ color: "white" }));
          return [...prev, ...newRows];
        }
        return prev.slice(0, newHeight);
      });
    }
  };

  const handleCellClick = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default context menu

    setGridCells((prev) => {
      const newGrid = [...prev];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = {
        color: e.button === 2 ? "white" : selectedColor, // Right click (2) clears the color
      };
      return newGrid;
    });
  };

  const getCellSize = () => {
    if (gridWidth <= 10 && gridHeight <= 10) {
      return 25;
    } else if (gridWidth <= 30 && gridHeight <= 30) {
      return 20;
    }
    return 15;
  };

  const renderGridCells = () => {
    const cells = [];
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        cells.unshift(
          <div
            key={`${row}-${col}`}
            className="grid-cell"
            style={{ backgroundColor: gridCells[row][col].color }}
            onClick={(e) => handleCellClick(row, col, e)}
            onContextMenu={(e) => handleCellClick(row, col, e)}
          />
        );
      }
    }
    return cells;
  };

  const cellSize = getCellSize();

  return (
    <>
      <div className="grid-controls">
        <div className="input-group">
          <label htmlFor="width">Width:</label>
          <input
            type="number"
            id="width"
            value={gridWidth}
            onChange={handleWidthChange}
            min="1"
            max="60"
          />
        </div>
        <div className="input-group">
          <label htmlFor="height">Height:</label>
          <input
            type="number"
            id="height"
            value={gridHeight}
            onChange={handleHeightChange}
            min="1"
            max="40"
          />
        </div>
      </div>

      <div className="knitting-grid-container">
        <div className="grid-wrapper">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${gridWidth}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${gridHeight}, ${cellSize}px)`,
              direction: "rtl",
            }}
          >
            {renderGridCells()}
          </div>
        </div>
        <ColorPicker
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      </div>
    </>
  );
};
