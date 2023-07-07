# © Microsoft. All rights reserved.

#' Add together two numbers.
#' 
#' @param x A number.
#' @param y A number.
#' @return The sum of \code{x} and \code{y}.
#' @examples
#' add(1, 1)
#' add(10, 1)
add <- function(x, y) {
  x + y
}

add(1, 2)
add(1.0, 2.0)
add(-1, -2)
add(-1.0, -2.0)
add(1.0e10, 2.0e10)


#' Concatenate together two strings.
#' 
#' @param x A string.
#' @param y A string.
#' @return The concatenated string built of \code{x} and \code{y}.
#' @examples
#' strcat("one", "two")
strcat <- function(x, y) {
  paste(x, y)
}

paste("one", "two")
paste('one', 'two')
paste(NULL, NULL)
paste(NA, NA)

paste("multi-
      line",
      'multi-
      line')
