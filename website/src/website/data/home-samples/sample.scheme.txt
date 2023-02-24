;;; make-matrix creates a matrix (a vector of vectors).
(define make-matrix
  (lambda (rows columns)
    (do ((m (make-vector rows))
         (i 0 (+ i 1)))
        ((= i rows) m)
        (vector-set! m i (make-vector columns)))))

;;; matrix? checks to see if its argument is a matrix.
;;; It isn't foolproof, but it's generally good enough.
(define matrix?
  (lambda (x)
    (and (vector? x)
         (> (vector-length x) 0)
         (vector? (vector-ref x 0)))))

;; matrix-rows returns the number of rows in a matrix.
(define matrix-rows
   (lambda (x)
      (vector-length x)))

;; matrix-columns returns the number of columns in a matrix.
(define matrix-columns
   (lambda (x)
      (vector-length (vector-ref x 0))))

;;; matrix-ref returns the jth element of the ith row.
(define matrix-ref
  (lambda (m i j)
    (vector-ref (vector-ref m i) j)))

;;; matrix-set! changes the jth element of the ith row.
(define matrix-set!
  (lambda (m i j x)
    (vector-set! (vector-ref m i) j x)))

;;; mul is the generic matrix/scalar multiplication procedure
(define mul
  (lambda (x y)
    ;; mat-sca-mul multiplies a matrix by a scalar.
    (define mat-sca-mul
       (lambda (m x)
          (let* ((nr (matrix-rows m))
                 (nc (matrix-columns m))
                 (r  (make-matrix nr nc)))
             (do ((i 0 (+ i 1)))
                 ((= i nr) r)
                 (do ((j 0 (+ j 1)))
                     ((= j nc))
                     (matrix-set! r i j
                        (* x (matrix-ref m i j))))))))

    ;; mat-mat-mul multiplies one matrix by another, after verifying
    ;; that the first matrix has as many columns as the second
    ;; matrix has rows.
    (define mat-mat-mul
       (lambda (m1 m2)
          (let* ((nr1 (matrix-rows m1))
                 (nr2 (matrix-rows m2))
                 (nc2 (matrix-columns m2))
                 (r   (make-matrix nr1 nc2)))
             (if (not (= (matrix-columns m1) nr2))
                 (match-error m1 m2))
             (do ((i 0 (+ i 1)))
                 ((= i nr1) r)
                 (do ((j 0 (+ j 1)))
                     ((= j nc2))
                     (do ((k 0 (+ k 1))
                          (a 0
                             (+ a
                                (* (matrix-ref m1 i k)
                                   (matrix-ref m2 k j)))))
                         ((= k nr2)
                          (matrix-set! r i j a))))))))

   ;; type-error is called to complain when mul receives an invalid
   ;; type of argument.
    (define type-error
       (lambda (what)
          (error 'mul
             "~s is not a number or matrix"
             what)))

    ;; match-error is called to complain when mul receives a pair of
    ;; incompatible arguments.
    (define match-error
       (lambda (what1 what2)
          (error 'mul
             "~s and ~s are incompatible operands"
             what1
             what2)))

    ;; body of mul; dispatch based on input types
    (cond
      ((number? x)
       (cond
         ((number? y) (* x y))
         ((matrix? y) (mat-sca-mul y x))
         (else (type-error y))))
      ((matrix? x)
       (cond
         ((number? y) (mat-sca-mul x y))
         ((matrix? y) (mat-mat-mul x y))
         (else (type-error y))))
      (else (type-error x)))))