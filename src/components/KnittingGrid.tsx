import { useState, useEffect } from "react";
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
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showFloatingBall, setShowFloatingBall] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isRightClick, setIsRightClick] = useState(false);

  // Handle cursor movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (showFloatingBall) {
        setCursorPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
      setIsRightClick(false);
    };

    const handleMouseLeave = () => {
      setIsMouseDown(false);
      setIsRightClick(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [showFloatingBall]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setShowFloatingBall(true);
  };

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

  const colorCell = (row: number, col: number, isRightClick: boolean) => {
    setGridCells((prev) => {
      const newGrid = [...prev];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = {
        color: isRightClick ? "white" : selectedColor,
      };
      return newGrid;
    });
  };

  const handleCellClick = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default context menu
    const rightClick = e.button === 2;
    setIsMouseDown(true);
    setIsRightClick(rightClick);

    if (rightClick) {
      setShowFloatingBall(false);
    }

    colorCell(row, col, rightClick);
  };

  const handleCellHover = (row: number, col: number) => {
    if (isMouseDown) {
      colorCell(row, col, isRightClick);
    }
  };

  const handleReset = () => {
    setGridCells(
      Array(gridHeight)
        .fill(null)
        .map(() => Array(gridWidth).fill({ color: "white" }))
    );
    setShowFloatingBall(false);
  };

  const getCellSize = () => {
    if (gridWidth <= 10 && gridHeight <= 10) {
      return 40;
    } else if (gridWidth <= 30 && gridHeight <= 30) {
      return 30;
    }
    return 25;
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
            onMouseDown={(e) => handleCellClick(row, col, e)}
            onMouseEnter={() => handleCellHover(row, col)}
            onContextMenu={(e) => e.preventDefault()}
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
      {showFloatingBall && (
        <div
          className="floating-color-ball"
          style={{
            backgroundColor: selectedColor,
            left: cursorPosition.x,
            top: cursorPosition.y,
          }}
        />
      )}
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
          onColorSelect={handleColorSelect}
          onReset={handleReset}
        />
      </div>
    </>
  );
};
