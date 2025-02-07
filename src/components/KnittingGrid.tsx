import { useState } from "react";
import { ColorPicker } from "./ColorPicker";
import "./KnittingGrid.css";

interface GridCell {
  color: string;
}

export const KnittingGrid = () => {
  const [gridWidth, setGridWidth] = useState(20);
  const [gridHeight, setGridHeight] = useState(20);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [gridCells, setGridCells] = useState<GridCell[][]>(() =>
    Array(20)
      .fill(null)
      .map(() => Array(20).fill({ color: "white" }))
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

  const handleReset = () => {
    // Reset all cells to white
    setGridCells(
      Array(gridHeight)
        .fill(null)
        .map(() => Array(gridWidth).fill({ color: "white" }))
    );
  };

  const getCellSize = () => {
    if (gridWidth <= 10 && gridHeight <= 10) {
      return 40; // Larger cells for small grids
    } else if (gridWidth <= 30 && gridHeight <= 30) {
      return 30; // Medium cells for medium grids
    }
    return 25; // Smaller cells for large grids
  };

  const getSpacing = () => {
    if (gridWidth <= 10 && gridHeight <= 10) {
      return {
        gap: "0.8px",
        padding: "15px",
        cellPadding: "15px",
      };
    } else if (gridWidth <= 32 && gridHeight <= 30) {
      return {
        gap: "0.6px",
        padding: "10px",
        cellPadding: "10px",
      };
    }
    return {
      gap: "0.1px",
      padding: "5px",
      cellPadding: "5px",
    };
  };

  const renderGridCells = () => {
    const cells = [];
    const { cellPadding } = getSpacing();
    for (let col = 0; col < gridWidth; col++) {
      for (let row = 0; row < gridHeight; row++) {
        cells.push(
          <div
            key={`${col}-${row}`}
            className="grid-cell"
            style={{
              backgroundColor: gridCells[row][col].color,
              padding: cellPadding,
            }}
            onClick={(e) => handleCellClick(row, col, e)}
            onContextMenu={(e) => handleCellClick(row, col, e)}
          />
        );
      }
    }
    return cells;
  };

  const cellSize = getCellSize();
  const spacing = getSpacing();

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
              gridTemplateRows: `repeat(${gridHeight}, ${cellSize * 1.2}px)`,
              gap: spacing.gap,
              padding: spacing.padding,
            }}
          >
            {renderGridCells()}
          </div>
        </div>
        <ColorPicker
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
          onReset={handleReset}
        />
      </div>
    </>
  );
};
