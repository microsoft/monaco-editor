(ns game-of-life
  "Conway's Game of Life, based on the work of
  Christophe Grand (http://clj-me.cgrand.net/2011/08/19/conways-game-of-life)
  and Laurent Petit (https://gist.github.com/1200343).")

;;; Core game of life's algorithm functions

(defn neighbors
  "Given a cell's coordinates `[x y]`, returns the coordinates of its
  neighbors."
  [[x y]]
  (for [dx [-1 0 1]
        dy (if (zero? dx)
             [-1 1]
             [-1 0 1])]
    [(+ dx x) (+ dy y)]))

(defn step
  "Given a set of living `cells`, computes the new set of living cells."
  [cells]
  (set (for [[cell n] (frequencies (mapcat neighbors cells))
             :when (or (= n 3)
                       (and (= n 2)
                            (cells cell)))]
         cell)))

;;; Utility methods for displaying game on a text terminal

(defn print-grid
  "Prints a `grid` of `w` columns and `h` rows, on *out*, representing a
  step in the game."
  [grid w h]
  (doseq [x (range (inc w))
          y (range (inc h))]
    (when (= y 0) (println))
    (print (if (grid [x y])
             "[X]"
             " . "))))

(defn print-grids
  "Prints a sequence of `grids` of `w` columns and `h` rows on *out*,
  representing several steps."
  [grids w h]
  (doseq [grid grids]
    (print-grid grid w h)
    (println)))

;;; Launches an example grid

(def grid
  "`grid` represents the initial set of living cells"
  #{[2 1] [2 2] [2 3]})

(print-grids (take 3 (iterate step grid)) 5 5)