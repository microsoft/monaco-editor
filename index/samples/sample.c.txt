// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full
// license information.

/*
 *	COMMAND LINE: -Ox -Gz -YX -UPROTOTYPES_REQUIRED
 */

#pragma warning(disable : 4532)
#pragma warning(disable : 4702)

#if defined(_WIN32)

#if defined(_M_SH)
#define WIN_CE
#endif

#if defined(_M_AMD64)
#define NEST_IN_FINALLY /* allow when __try nested in __finally OK */
#endif

#define NTSTATUS LONG
#define EXCEPTION_NESTED_CALL 0x10
#define RtlRaiseStatus(x) RaiseException((x), 0, 0, NULL)
#define RtlRaiseException(x)                                                   \
  RaiseException((x)->ExceptionCode, (x)->ExceptionFlags,                      \
                 (x)->NumberParameters, (x)->ExceptionInformation)
#define IN
#define OUT
#if !(defined(_M_IA64) || defined(_M_ALPHA) || defined(_M_PPC) ||              \
      defined(_M_AMD64) || defined(_M_ARM) || defined(_M_ARM64))
#define i386 1
#endif
#define try __try
#define except __except
#define finally __finally
#define leave __leave

#endif

#define WIN32_LEAN_AND_MEAN

#include "stdio.h"
#if defined(_M_IA64) || defined(_M_ALPHA) || defined(_M_PPC) ||                \
    defined(_M_AMD64) || defined(_M_ARM) || defined(_M_ARM64)
#include "setjmpex.h"
#else
#include "setjmp.h"
#endif
#include "float.h"
#include "windows.h"
#include "math.h"

#if !defined(STATUS_SUCCESS)
#define STATUS_SUCCESS 0
#endif
#if !defined(STATUS_UNSUCCESSFUL)
#define STATUS_UNSUCCESSFUL ((NTSTATUS)0xC0000001L)
#endif

//
// Define switch constants.
//

#define BLUE 0
#define RED 1

//
// Define function prototypes.
//

VOID addtwo(IN LONG First, IN LONG Second, IN PLONG Place);

VOID bar1(IN NTSTATUS Status, IN PLONG Counter);

VOID bar2(IN PLONG BlackHole, IN PLONG BadAddress, IN PLONG Counter);

VOID dojump(IN jmp_buf JumpBuffer, IN PLONG Counter);

LONG Echo(IN LONG Value);

#if !defined(WIN_CE) // return through finally not allowed on WinCE
VOID eret(IN NTSTATUS Status, IN PLONG Counter);
#endif

VOID except1(IN PLONG Counter);

ULONG
except2(IN PEXCEPTION_POINTERS ExceptionPointers, IN PLONG Counter);

ULONG
except3(IN PEXCEPTION_POINTERS ExceptionPointers, IN PLONG Counter);

VOID foo1(IN NTSTATUS Status);

VOID foo2(IN PLONG BlackHole, IN PLONG BadAddress);

#if !defined(WIN_CE) // return from finally not allowed on WinCE
VOID fret(IN PLONG Counter);
#endif

BOOLEAN
Tkm(VOID);

VOID Test61Part2(IN OUT PULONG Counter);

double SquareDouble(IN double op);

DECLSPEC_NOINLINE
ULONG
PgFilter(VOID)

{

  printf("filter entered...");
  return EXCEPTION_EXECUTE_HANDLER;
}

#pragma warning(push)
#pragma warning(disable : 4532)

VOID PgTest69(IN PLONG State, IN PLONG Fault)

{

  try {
    try {
      *Fault += 1;
    }
    finally {
      if (AbnormalTermination()) {
        if (*State == 1) {
          *State += 1;

        } else {
          *Fault += 1;
        }
      }
    }
  }
  except(((*State += 1) == 1) ? PgFilter() : EXCEPTION_CONTINUE_SEARCH) {
    if (*State != 2) {
      *Fault += 1;
    }
  }

  return;
}

VOID PgTest70(IN PLONG State, IN PLONG Fault)

{

  try {
    try {
      *Fault += 1;
    }
    finally {
      if (AbnormalTermination()) {
        if (*State == 2) {
          PgFilter();
          return;

        } else {
          *Fault += 1;
        }
      }
    }
  }
  except(((*State += 2) == 2) ? EXCEPTION_EXECUTE_HANDLER
                              : EXCEPTION_CONTINUE_SEARCH) {
    *Fault += 1;
  }

  return;
}

VOID PgTest71(IN PLONG State, IN PLONG Fault)

{

  try {
    try {
      try {
        *Fault += 1;
      }
      finally {
        if (AbnormalTermination()) {
          if (*State == 3) {
            *State += 3;
            return;

          } else {
            *Fault += 1;
          }
        }
      }
    }
    finally {
      if (AbnormalTermination()) {
        if (*State == 6) {
          *State += 3;

        } else {
          *Fault += 1;
        }
      }
    }
  }
  except(((*State += 3) == 3) ? PgFilter() : EXCEPTION_CONTINUE_SEARCH) {
    *Fault += 1;
  }

  return;
}

VOID PgTest72(IN PLONG State, IN PLONG Fault)

{

  try {
    try {
      try {
        *Fault += 1;
      }
      finally {
        if (AbnormalTermination()) {
          if (*State == 4) {
            *State += 4;
            return;

          } else {
            *Fault += 1;
          }
        }
      }
    }
    finally {
      if (AbnormalTermination()) {
        if (*State == 8) {
          *State += 4;
          PgFilter();

        } else {
          *Fault += 1;
        }
      }
    }
  }
  except(((*State += 4) == 4) ? EXCEPTION_EXECUTE_HANDLER
                              : EXCEPTION_CONTINUE_SEARCH) {
    *Fault += 1;
  }

  return;
}

VOID PgTest73(IN PLONG State, IN PLONG Fault)

{

  try {
    try {
      try {
        *Fault += 1;
      }
      finally {
        if (AbnormalTermination()) {
          if (*State == 5) {
            *State += 5;

          } else {
            *Fault += 1;
          }
        }
      }
    }
    finally {
      if (AbnormalTermination()) {
        if (*State == 10) {
          *State += 5;
          return;

        } else {
          *Fault += 1;
        }
      }
    }
  }
  except(((*State += 5) == 5) ? PgFilter() : EXCEPTION_CONTINUE_SEARCH) {
    *Fault += 1;
  }

  return;
}

VOID PgTest74(IN PLONG State, IN PLONG Fault)

{

  try {
    try {
      try {
        *Fault += 1;
      }
      finally {
        if (AbnormalTermination()) {
          if (*State == 6) {
            *State += 6;

          } else {
            *Fault += 1;
          }
        }
      }
    }
    finally {
      if (AbnormalTermination()) {
        if (*State == 12) {
          *State += 6;
          PgFilter();
          return;

        } else {
          *Fault += 1;
        }
      }
    }
  }
  except(((*State += 6) == 6) ? EXCEPTION_EXECUTE_HANDLER
                              : EXCEPTION_CONTINUE_SEARCH) {
    *Fault += 1;
  }

  return;
}

VOID PgTest75(IN PLONG State, IN PLONG Fault)

{

  try {
    try {
      try {
        try {
          *Fault += 1;
        }
        finally {
          if (AbnormalTermination()) {
            if (*State == 7) {
              *State += 7;
              *Fault += 1;

            } else {
              *State += 10;
            }
          }
        }
      }
      except(((*State += 7) == 7) ? EXCEPTION_EXECUTE_HANDLER
                                  : EXCEPTION_CONTINUE_SEARCH) {
        *Fault += 1;
      }
    }
    finally {
      if (AbnormalTermination()) {
        if (*State == 28) {
          *State += 7;
          return;

        } else {
          *Fault += 1;
        }
      }
    }
  }
  except(((*State += 7) == 28) ? PgFilter() : EXCEPTION_CONTINUE_SEARCH) {
    *Fault += 1;
  }

  return;
}

VOID PgTest76(IN PLONG State, IN PLONG Fault)

{

  try {
    try {
      try {
        try {
          *Fault += 1;
        }
        finally {
          if (AbnormalTermination()) {
            if (*State == 8) {
              *State += 8;
              *Fault += 1;

            } else {
              *State += 10;
            }
          }
        }
      }
      except(((*State += 8) == 8) ? EXCEPTION_EXECUTE_HANDLER
                                  : EXCEPTION_CONTINUE_SEARCH) {
        *Fault += 1;
      }
    }
    finally {
      if (AbnormalTermination()) {
        if (*State == 32) {
          *State += 8;
          PgFilter();
          return;

        } else {
          *Fault += 1;
        }
      }
    }
  }
  except(((*State += 8) == 32) ? EXCEPTION_EXECUTE_HANDLER
                               : EXCEPTION_CONTINUE_SEARCH) {
    *Fault += 1;
  }

  return;
}

VOID PgTest77(IN PLONG State, IN PLONG Fault)

{

  try {
    try {
      try {
        try {
          *Fault += 1;
        }
        finally {
          if (AbnormalTermination()) {
            if (*State == 9) {
              *State += 9;
              *Fault += 1;

            } else {
              *State += 10;
            }
          }
        }
      }
      except(((*State += 9) == 9) ? PgFilter() : EXCEPTION_CONTINUE_SEARCH) {
        *Fault += 1;
      }
    }
    finally {
      if (AbnormalTermination()) {
        if (*State == 36) {
          *State += 9;
          return;

        } else {
          *Fault += 1;
        }
      }
    }
  }
  except(((*State += 9) == 36) ? EXCEPTION_EXECUTE_HANDLER
                               : EXCEPTION_CONTINUE_SEARCH) {
    *Fault += 1;
  }

  return;
}

VOID PgTest78(IN PLONG State, IN PLONG Fault)

{

  try {
    try {
      try {
        try {
          *Fault += 1;
        }
        finally {
          if (AbnormalTermination()) {
            if (*State == 10) {
              *State += 10;
              PgFilter();
              *Fault += 1;

            } else {
              *State += 10;
            }
          }
        }
      }
      except(((*State += 10) == 10) ? EXCEPTION_EXECUTE_HANDLER
                                    : EXCEPTION_CONTINUE_SEARCH) {
        *Fault += 1;
      }
    }
    finally {
      if (AbnormalTermination()) {
        if (*State == 40) {
          *State += 10;
          return;

        } else {
          *Fault += 1;
        }
      }
    }
  }
  except(((*State += 10) == 40) ? EXCEPTION_EXECUTE_HANDLER
                                : EXCEPTION_CONTINUE_SEARCH) {
    *Fault += 1;
  }

  return;
}

#pragma warning(pop)

VOID Test79(PLONG Counter, PLONG Fault)

{

  try {
    try {
      try {
        *Fault += 1;
      }
      finally {
        printf("finally 1...");
        *Fault += 1;
      }
    }
    finally { printf("finally 2..."); }
  }
  except(*Counter += 1, printf("filter 1..."), EXCEPTION_CONTINUE_SEARCH) {}

  return;
}

ULONG G;

ULONG
Test80(VOID)

{

  G = 1;
  try {
    while (G) {
      try {
        if (G == 10) {
          return 1;
        }

        if (G == 1) {
          continue;
        }
      }
      finally { G = 0; }
    }
  }
  finally { G = 10; }

  return 0;
}

void Test81(int *pCounter) {
  volatile char *AvPtr = NULL;

  __try {
    __try { *AvPtr = '\0'; }
    __except(EXCEPTION_EXECUTE_HANDLER) { __leave; }
  }
  __finally {
    printf("in finally ");
    *pCounter += 1;
  }
  return;
}

DECLSPEC_NOINLINE
VOID Test82Foo(VOID)

{
  *(volatile int *)0 = 0;
}

VOID Test82(__inout PLONG Counter)

{

  int retval = 1;

  __try {
    __try { Test82Foo(); }
    __finally {
      switch (*Counter) {
      case 0:
        printf("something failed!\n");
        retval = 6;
        break;

      case 1:
        retval = 0;
        break;

      case 2:
        printf("how did you get here?\n");
        retval = 2;
        break;

      case 3:
        printf("what?!?\n");
        retval = 3;
        break;

      case 4:
        printf("not correct\n");
        retval = 4;
        break;

      case 5:
        printf("error!\n");
        retval = 5;
        break;
      }
    }
  }
  __except(1){}

  *Counter = retval;
  return;
}

LONG Test83(VOID)

{

  G = 1;
  try {
    try {
      while (G) {
        try {
          if (G == 10) {
            return 1;
          }

          if (G == 1) {
            continue;
          }
        }
        finally { G = 0; }
      }
    }
    except(EXCEPTION_EXECUTE_HANDLER) { leave; }
  }
  finally { G = 10; }

  return 0;
}

DECLSPEC_NOINLINE
VOID Test84(_Inout_ PLONG Counter)

{
  volatile int *Fault = 0;

  try {
    try {
      *Fault += 1;
    }
    except(EXCEPTION_EXECUTE_HANDLER) {
      try {
        return;
      }
      finally { *Counter += 1; }
    }
  }
  finally {

    if (AbnormalTermination()) {
      *Counter += 1;
    }
  }

  return;
}

DECLSPEC_NOINLINE
LONG Test85(_Inout_ PLONG Counter)

{
  volatile int *Fault = 0;

  G = 1;
  try {
    try {
      try {
        while (G) {
          try {
            try {
              if (G == 10) {
                return 1;
              }
              try {
                *Counter += 1;
              }
              except(EXCEPTION_EXECUTE_HANDLER) {}

              if (G == 1) {
                continue;
              }
            }
            finally {
              G = 0;
              *Counter += 1;
              *Fault += 1;
            }
          }
          except(EXCEPTION_EXECUTE_HANDLER) {
            *Counter += 1;
            leave;
          }
        }
      }
      finally {
        G = 10;
        *Counter += 1;
        *Fault += 1;
      }
    }
    except(EXCEPTION_EXECUTE_HANDLER) { *Counter += 1; }
    *Counter += 1;
  }
  finally { *Counter += 1; }
  return 1;
}

DECLSPEC_NOINLINE
VOID Test86(_Inout_ PLONG Counter)

{
  volatile int *Fault = 0;

  try {
    try {
      try {
        try {
          try {
            try {
              *Fault += 1;
            }
            except(printf("Filter1 %d..", *Counter),
                   EXCEPTION_EXECUTE_HANDLER) {
              try {
                printf("Handler1 %d..", *Counter);
                return;
              }
              finally {
                printf("Finally1 %d..", *Counter);
                *Counter += 1;
              }
            }
          }
          finally {
            printf("Finally2 %d..", *Counter);
            *Counter += 1;
          }
        }
        except(EXCEPTION_EXECUTE_HANDLER) { leave; }
      }
      finally { *Counter += 1; }
    }
    except(EXCEPTION_EXECUTE_HANDLER) { leave; }
  }
  finally { *Counter += 1; }

  return;
}

VOID Test87(_Inout_ PLONG Counter)

/*++

Routine Description:

    This function verifies the behavior of nested exception dispatching.

Arguments:

    Counter - Supplies a pointer to the state counter.

Return Value:
    None.

--*/

{
  volatile int *Fault = 0;

//
// N.B.  Disabled on x86 due to failing test case with handling of returns
//       in nested termination handlers on x86.
//
//       Disabled on ARM due to failing test case with handling of abutting
//       termination handlers within an except handler.
//
//       Disabled on AMD64 due to failing test case with handling of
//       abutting termination handlers within an except handler when a
//       non-local goto is involved.
//

#if !defined(_X86_)
  try {
    try {
      try {
        try {
          try {
            *Fault += 1;

            try {
            }
            finally {
              if (AbnormalTermination()) {
                *Fault += 1;
              }
            }
          }
          finally {

            if (AbnormalTermination()) {
              if ((*Counter += 13) == 26) {
                return;

              } else {
                *Fault += 1;
              }
            }
          }
        }
        finally {
          if (AbnormalTermination()) {
            *Counter += 13;
            *Fault += 1;
          }
        }
      }
      except(((*Counter += 13) == 13) ? EXCEPTION_EXECUTE_HANDLER
                                      : EXCEPTION_CONTINUE_SEARCH) {
        *Fault += 1;
      }
    }
    except(((*Counter += 13) == 65) ? EXCEPTION_EXECUTE_HANDLER
                                    : EXCEPTION_CONTINUE_SEARCH) {
      try {
        *Counter += 13;
        return;
      }
      finally {
        if (AbnormalTermination()) {
          *Counter += 13;
          goto Finish;
        }
      }
    }
  }
  finally {

    if (AbnormalTermination()) {
      if ((*Counter += 13) == 104) {
        goto Finish;
      }
    }
  }

Finish:
#else
  *Counter = 104;
#endif

  return;
}

VOID Test88(_Inout_ PLONG Counter)

{
  volatile int *Fault = 0;

  try {
    try {
      try {
        try {
          try {
            try {
              try {
                try {
                  *Fault += 1;
                }
                except(((*Counter += 1) == 1) ? *Fault
                                              : EXCEPTION_CONTINUE_SEARCH) {}
              }
              except(*Counter += 1, EXCEPTION_EXECUTE_HANDLER) { *Fault += 2; }
            }
            except(*Counter += 1, EXCEPTION_CONTINUE_SEARCH) { leave; }
          }
          except(*Counter += 1, EXCEPTION_CONTINUE_SEARCH) { leave; }
        }
        except(EXCEPTION_EXECUTE_HANDLER) {}
      }
      except(EXCEPTION_EXECUTE_HANDLER) {}
    }
    except(EXCEPTION_EXECUTE_HANDLER) { leave; }
  }
  finally { *Counter += 1; }
}

int main(int argc, char *argv[])

{

  PLONG BadAddress;
  PCHAR BadByte;
  PLONG BlackHole;
  ULONG Index1;
  ULONG Index2 = RED;
  jmp_buf JumpBuffer;
  LONG Counter;
  EXCEPTION_RECORD ExceptionRecord;
  double doubleresult;

  //
  // Announce start of exception test.
  //

  printf("Start of exception test\n");

  //
  // Initialize exception record.
  //

  ExceptionRecord.ExceptionCode = STATUS_INTEGER_OVERFLOW;
  ExceptionRecord.ExceptionFlags = 0;
  ExceptionRecord.ExceptionRecord = NULL;
  ExceptionRecord.NumberParameters = 0;

  //
  // Initialize pointers.
  //

  BadAddress = (PLONG)NULL;
  BadByte = (PCHAR)NULL;
  BadByte += 1;
  BlackHole = &Counter;

  //
  // Simply try statement with a finally clause that is entered sequentially.
  //

  printf("    test1...");
  Counter = 0;
  try {
    Counter += 1;
  }
  finally {
    if (abnormal_termination() == FALSE) {
      Counter += 1;
    }
  }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Simple try statement with an exception clause that is never executed
  // because there is no exception raised in the try clause.
  //

  printf("    test2...");
  Counter = 0;
  try {
    Counter += 1;
  }
  except(Counter) { Counter += 1; }

  if (Counter != 1) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Simple try statement with an exception handler that is never executed
  // because the exception expression continues execution.
  //

  printf("    test3...");
  Counter = 0;
  try {
    Counter -= 1;
    RtlRaiseException(&ExceptionRecord);
  }
  except(Counter) { Counter -= 1; }

  if (Counter != -1) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Simple try statement with an exception clause that is always executed.
  //

  printf("    test4...");
  Counter = 0;
  try {
    Counter += 1;
    RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
  }
  except(Counter) { Counter += 1; }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Simple try statement with an exception clause that is always executed.
  //

  printf("    test5...");
  Counter = 0;
  try {
    Counter += 1;
    *BlackHole += *BadAddress;
  }
  except(Counter) { Counter += 1; }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Simply try statement with a finally clause that is entered as the
  // result of an exception.
  //

  printf("    test6...");
  Counter = 0;
  try {
    try {
      Counter += 1;
      RtlRaiseException(&ExceptionRecord);
    }
    finally {
      if (abnormal_termination() != FALSE) {
        Counter += 1;
      }
    }
  }
  except(Counter) {
    if (Counter == 2) {
      Counter += 1;
    }
  }

  if (Counter != 3) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Simply try statement with a finally clause that is entered as the
  // result of an exception.
  //

  printf("    test7...");
  Counter = 0;
  try {
    try {
      Counter += 1;
      *BlackHole += *BadAddress;
    }
    finally {
      if (abnormal_termination() != FALSE) {
        Counter += 1;
      }
    }
  }
  except(Counter) {
    if (Counter == 2) {
      Counter += 1;
    }
  }

  if (Counter != 3) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Simple try that calls a function which raises an exception.
  //

  printf("    test8...");
  Counter = 0;
  try {
    Counter += 1;
    foo1(STATUS_ACCESS_VIOLATION);
  }
  except((GetExceptionCode() == STATUS_ACCESS_VIOLATION)
             ? EXCEPTION_EXECUTE_HANDLER
             : EXCEPTION_CONTINUE_SEARCH) {
    Counter += 1;
  }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Simple try that calls a function which raises an exception.
  //

  printf("    test9...");
  Counter = 0;
  try {
    Counter += 1;
    foo2(BlackHole, BadAddress);
  }
  except((GetExceptionCode() == STATUS_ACCESS_VIOLATION)
             ? EXCEPTION_EXECUTE_HANDLER
             : EXCEPTION_CONTINUE_SEARCH) {
    Counter += 1;
  }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Simple try that calls a function which calls a function that
  // raises an exception. The first function has a finally clause
  // that must be executed for this test to work.
  //

  printf("    test10...");
  Counter = 0;
  try {
    bar1(STATUS_ACCESS_VIOLATION, &Counter);
  }
  except((GetExceptionCode() == STATUS_ACCESS_VIOLATION)
             ? EXCEPTION_EXECUTE_HANDLER
             : EXCEPTION_CONTINUE_SEARCH) {
    Counter -= 1;
  }

  if (Counter != 98) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Simple try that calls a function which calls a function that
  // raises an exception. The first function has a finally clause
  // that must be executed for this test to work.
  //

  printf("    test11...");
  Counter = 0;
  try {
    bar2(BlackHole, BadAddress, &Counter);
  }
  except((GetExceptionCode() == STATUS_ACCESS_VIOLATION)
             ? EXCEPTION_EXECUTE_HANDLER
             : EXCEPTION_CONTINUE_SEARCH) {
    Counter -= 1;
  }

  if (Counter != 98) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A try within an except
  //

  printf("    test12...");
  Counter = 0;
  try {
    foo1(STATUS_ACCESS_VIOLATION);
  }
  except((GetExceptionCode() == STATUS_ACCESS_VIOLATION)
             ? EXCEPTION_EXECUTE_HANDLER
             : EXCEPTION_CONTINUE_SEARCH) {
    Counter += 1;
    try {
      foo1(STATUS_SUCCESS);
    }
    except((GetExceptionCode() == STATUS_SUCCESS) ? EXCEPTION_EXECUTE_HANDLER
                                                  : EXCEPTION_CONTINUE_SEARCH) {
      if (Counter != 1) {
        printf("failed, count = %d\n", Counter);

      } else {
        printf("succeeded...");
      }

      Counter += 1;
    }
  }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A try within an except
  //

  printf("    test13...");
  Counter = 0;
  try {
    foo2(BlackHole, BadAddress);
  }
  except((GetExceptionCode() == STATUS_ACCESS_VIOLATION)
             ? EXCEPTION_EXECUTE_HANDLER
             : EXCEPTION_CONTINUE_SEARCH) {
    Counter += 1;
    try {
      foo1(STATUS_SUCCESS);
    }
    except((GetExceptionCode() == STATUS_SUCCESS) ? EXCEPTION_EXECUTE_HANDLER
                                                  : EXCEPTION_CONTINUE_SEARCH) {
      if (Counter != 1) {
        printf("failed, count = %d\n", Counter);

      } else {
        printf("succeeded...");
      }

      Counter += 1;
    }
  }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

#if !defined(WIN_CE) // gotos from except/finally not allowed on WinCE
  //
  // A goto from an exception clause that needs to pass
  // through a finally
  //

  printf("    test14...");
  Counter = 0;
  try {
    try {
      foo1(STATUS_ACCESS_VIOLATION);
    }
    except((GetExceptionCode() == STATUS_ACCESS_VIOLATION)
               ? EXCEPTION_EXECUTE_HANDLER
               : EXCEPTION_CONTINUE_SEARCH) {
      Counter += 1;
      goto t9;
    }
  }
  finally { Counter += 1; }

t9:
  ;
  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A goto from an finally clause that needs to pass
  // through a finally
  //

  printf("    test15...");
  Counter = 0;
  try {
    try {
      Counter += 1;
    }
    finally {
      Counter += 1;
      goto t10;
    }
  }
  finally { Counter += 1; }

t10:
  ;
  if (Counter != 3) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A goto from an exception clause that needs to pass
  // through a finally into the outer finally clause.
  //

  printf("    test16...");
  Counter = 0;
  try {
    try {
      try {
        Counter += 1;
        foo1(STATUS_INTEGER_OVERFLOW);
      }
      except(EXCEPTION_EXECUTE_HANDLER) {
        Counter += 1;
        goto t11;
      }
    }
    finally { Counter += 1; }
  t11:
    ;
  }
  finally { Counter += 1; }

  if (Counter != 4) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A goto from an finally clause that needs to pass
  // through a finally into the outer finally clause.
  //

  printf("    test17...");
  Counter = 0;
  try {
    try {
      Counter += 1;
    }
    finally {
      Counter += 1;
      goto t12;
    }
  t12:
    ;
  }
  finally { Counter += 1; }

  if (Counter != 3) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A return from an except clause
  //

  printf("    test18...");
  Counter = 0;
  try {
    Counter += 1;
    eret(STATUS_ACCESS_VIOLATION, &Counter);
  }
  finally { Counter += 1; }

  if (Counter != 4) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A return from a finally clause
  //

  printf("    test19...");
  Counter = 0;
  try {
    Counter += 1;
    fret(&Counter);
  }
  finally { Counter += 1; }

  if (Counter != 5) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }
#endif

  //
  // A simple set jump followed by a long jump.
  //

  printf("    test20...");
  Counter = 0;
  if (setjmp(JumpBuffer) == 0) {
    Counter += 1;
    longjmp(JumpBuffer, 1);

  } else {
    Counter += 1;
  }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A set jump followed by a long jump out of a finally clause that is
  // sequentially executed.
  //

  printf("    test21...");
  Counter = 0;
  if (setjmp(JumpBuffer) == 0) {
    try {
      Counter += 1;
    }
    finally {
      Counter += 1;
      longjmp(JumpBuffer, 1);
    }

  } else {
    Counter += 1;
  }

  if (Counter != 3) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A set jump within a try clause followed by a long jump out of a
  // finally clause that is sequentially executed.
  //

  printf("    test22...");
  Counter = 0;
  try {
    if (setjmp(JumpBuffer) == 0) {
      Counter += 1;

    } else {
      Counter += 1;
    }
  }
  finally {
    Counter += 1;
    if (Counter == 2) {
      Counter += 1;
      longjmp(JumpBuffer, 1);
    }
  }

  if (Counter != 5) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A set jump followed by a try/except, followed by a try/finally where
  // the try body of the try/finally raises an exception that is handled
  // by the try/excecpt which causes the try/finally to do a long jump out
  // of a finally clause. This will create a collided unwind.
  //

  printf("    test23...");
  Counter = 0;
  if (setjmp(JumpBuffer) == 0) {
    try {
      try {
        Counter += 1;
        RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
      }
      finally {
        Counter += 1;
        longjmp(JumpBuffer, 1);
      }
    }
    except(EXCEPTION_EXECUTE_HANDLER) { Counter += 1; }

  } else {
    Counter += 1;
  }

  if (Counter != 3) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A set jump followed by a try/except, followed by a several nested
  // try/finally's where the inner try body of the try/finally raises an
  // exception that is handled by the try/except which causes the
  // try/finally to do a long jump out of a finally clause. This will
  // create a collided unwind.
  //

  printf("    test24...");
  Counter = 0;
  if (setjmp(JumpBuffer) == 0) {
    try {
      try {
        try {
          try {
            Counter += 1;
            RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
          }
          finally { Counter += 1; }
        }
        finally {
          Counter += 1;
          longjmp(JumpBuffer, 1);
        }
      }
      finally { Counter += 1; }
    }
    except(EXCEPTION_EXECUTE_HANDLER) { Counter += 1; }

  } else {
    Counter += 1;
  }

  if (Counter != 5) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A set jump followed by a try/except, followed by a try/finally which
  // calls a subroutine which contains a try finally that raises an
  // exception that is handled to the try/except.
  //

  printf("    test25...");
  Counter = 0;
  if (setjmp(JumpBuffer) == 0) {
    try {
      try {
        try {
          Counter += 1;
          dojump(JumpBuffer, &Counter);
        }
        finally { Counter += 1; }
      }
      finally { Counter += 1; }
    }
    except(EXCEPTION_EXECUTE_HANDLER) { Counter += 1; }

  } else {
    Counter += 1;
  }

  if (Counter != 7) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A set jump followed by a try/except, followed by a try/finally which
  // calls a subroutine which contains a try finally that raises an
  // exception that is handled to the try/except.
  //

  printf("    test26...");
  Counter = 0;
  if (setjmp(JumpBuffer) == 0) {
    try {
      try {
        try {
          try {
            Counter += 1;
            dojump(JumpBuffer, &Counter);
          }
          finally { Counter += 1; }
        }
        finally {
          Counter += 1;
          longjmp(JumpBuffer, 1);
        }
      }
      finally { Counter += 1; }
    }
    except(EXCEPTION_EXECUTE_HANDLER) { Counter += 1; }

  } else {
    Counter += 1;
  }

  if (Counter != 8) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Test nested exceptions.
  //

  printf("    test27...");
  Counter = 0;
  try {
    try {
      Counter += 1;
      except1(&Counter);
    }
    except(except2(GetExceptionInformation(), &Counter)) { Counter += 2; }
  }
  except(EXCEPTION_EXECUTE_HANDLER) { Counter += 3; }

  if (Counter != 55) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Simple try that causes an integer overflow exception.
  //

  printf("    test28...");
  Counter = 0;
  try {
    Counter += 1;
    addtwo(0x7fff0000, 0x10000, &Counter);
  }
  except((GetExceptionCode() == STATUS_INTEGER_OVERFLOW)
             ? EXCEPTION_EXECUTE_HANDLER
             : EXCEPTION_CONTINUE_SEARCH) {
    Counter += 1;
  }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

//
// Simple try that raises an misaligned data exception.
//
#if !defined(i386) && !defined(_M_IA64) && !defined(_M_AMD64) &&               \
    !defined(_M_ARM) && !defined(_M_ARM64)
  printf("    test29...");
  Counter = 0;
  try {
    Counter += 1;
    foo2(BlackHole, (PLONG)BadByte);
  }
  except((GetExceptionCode() == STATUS_DATATYPE_MISALIGNMENT)
             ? EXCEPTION_EXECUTE_HANDLER
             : EXCEPTION_CONTINUE_SEARCH) {
    Counter += 1;
  }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

#endif
  //
  // Continue from a try body with an exception clause in a loop.
  //

  printf("    test30...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      if ((Index1 & 0x1) == 0) {
        continue;

      } else {
        Counter += 1;
      }
    }
    except(EXCEPTION_EXECUTE_HANDLER) { Counter += 40; }

    Counter += 2;
  }

  if (Counter != 15) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

#if !defined(WIN_CE) // gotos from try/finally not allowed on WinCE
  //
  // Continue from a try body with an finally clause in a loop.
  //

  printf("    test31...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      if ((Index1 & 0x1) == 0) {
        continue;

      } else {
        Counter += 1;
      }
    }
    finally { Counter += 2; }

    Counter += 3;
  }

  if (Counter != 40) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }
#endif

  //
  // Continue from doubly nested try body with an exception clause in a
  // loop.
  //

  printf("    test32...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      try {
        if ((Index1 & 0x1) == 0) {
          continue;

        } else {
          Counter += 1;
        }
      }
      except(EXCEPTION_EXECUTE_HANDLER) { Counter += 10; }

      Counter += 2;
    }
    except(EXCEPTION_EXECUTE_HANDLER) { Counter += 20; }

    Counter += 3;
  }

  if (Counter != 30) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

#if !defined(WIN_CE) // gotos from try/finally not allowed on WinCE
  //
  // Continue from doubly nested try body with an finally clause in a loop.
  //

  printf("    test33...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      try {
        if ((Index1 & 0x1) == 0) {
          continue;

        } else {
          Counter += 1;
        }
      }
      finally { Counter += 2; }

      Counter += 3;
    }
    finally { Counter += 4; }

    Counter += 5;
  }

  if (Counter != 105) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Continue from a finally clause in a loop.
  //

  printf("    test34...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      if ((Index1 & 0x1) == 0) {
        Counter += 1;
      }
    }
    finally {
      Counter += 2;
      continue;
    }

    Counter += 4;
  }

  if (Counter != 25) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Continue from a doubly nested finally clause in a loop.
  //

  printf("    test35...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      try {
        if ((Index1 & 0x1) == 0) {
          Counter += 1;
        }
      }
      finally {
        Counter += 2;
        continue;
      }

      Counter += 4;
    }
    finally { Counter += 5; }

    Counter += 6;
  }

  if (Counter != 75) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Continue from a doubly nested finally clause in a loop.
  //

  printf("    test36...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      try {
        if ((Index1 & 0x1) == 0) {
          Counter += 1;
        }
      }
      finally { Counter += 2; }

      Counter += 4;
    }
    finally {
      Counter += 5;
      continue;
    }

    Counter += 6;
  }

  if (Counter != 115) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }
#endif

  //
  // Break from a try body with an exception clause in a loop.
  //

  printf("    test37...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      if ((Index1 & 0x1) == 1) {
        break;

      } else {
        Counter += 1;
      }
    }
    except(EXCEPTION_EXECUTE_HANDLER) { Counter += 40; }

    Counter += 2;
  }

  if (Counter != 3) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

#if !defined(WIN_CE) // gotos from try/finally not allowed on WinCE
  //
  // Break from a try body with an finally clause in a loop.
  //

  printf("    test38...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      if ((Index1 & 0x1) == 1) {
        break;

      } else {
        Counter += 1;
      }
    }
    finally { Counter += 2; }

    Counter += 3;
  }

  if (Counter != 8) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }
#endif

  //
  // Break from doubly nested try body with an exception clause in a
  // loop.
  //

  printf("    test39...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      try {
        if ((Index1 & 0x1) == 1) {
          break;

        } else {
          Counter += 1;
        }
      }
      except(EXCEPTION_EXECUTE_HANDLER) { Counter += 10; }

      Counter += 2;
    }
    except(EXCEPTION_EXECUTE_HANDLER) { Counter += 20; }

    Counter += 3;
  }

  if (Counter != 6) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

#if !defined(WIN_CE) // gotos from try/finally not allowed on WinCE
  //
  // Break from doubly nested try body with an finally clause in a loop.
  //

  printf("    test40...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      try {
        if ((Index1 & 0x1) == 1) {
          break;

        } else {
          Counter += 1;
        }
      }
      finally { Counter += 2; }

      Counter += 3;
    }
    finally { Counter += 4; }

    Counter += 5;
  }

  if (Counter != 21) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Break from a finally clause in a loop.
  //

  printf("    test41...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      if ((Index1 & 0x1) == 1) {
        Counter += 1;
      }
    }
    finally {
      Counter += 2;
      break;
    }

    Counter += 4;
  }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Break from a doubly nested finally clause in a loop.
  //

  printf("    test42...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      try {
        if ((Index1 & 0x1) == 1) {
          Counter += 1;
        }
      }
      finally {
        Counter += 2;
        break;
      }

      Counter += 4;
    }
    finally { Counter += 5; }

    Counter += 6;
  }

  if (Counter != 7) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Break from a doubly nested finally clause in a loop.
  //

  printf("    test43...");
  Counter = 0;
  for (Index1 = 0; Index1 < 10; Index1 += 1) {
    try {
      try {
        if ((Index1 & 0x1) == 1) {
          Counter += 1;
        }
      }
      finally { Counter += 2; }

      Counter += 4;
    }
    finally {
      Counter += 5;
      break;
    }

    Counter += 6;
  }

  if (Counter != 11) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }
#endif

  //
  // Break from a try body with an exception clause in a switch.
  //

  printf("    test44...");
  Counter = 0;
  Index1 = 1;
  switch (Index2) {
  case BLUE:
    Counter += 100;
    break;

  case RED:
    try {
      if ((Index1 & 0x1) == 1) {
        break;

      } else {
        Counter += 1;
      }
    }
    except(EXCEPTION_EXECUTE_HANDLER) { Counter += 40; }

    Counter += 2;
    break;
  }

  if (Counter != 0) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

#if !defined(WIN_CE) // gotos from try/finally not allowed on WinCE
  //
  // Break from a try body with an finally clause in a switch.
  //

  printf("    test45...");
  Counter = 0;
  Index1 = 1;
  switch (Index2) {
  case BLUE:
    Counter += 100;
    break;

  case RED:
    try {
      if ((Index1 & 0x1) == 1) {
        break;

      } else {
        Counter += 1;
      }
    }
    finally { Counter += 2; }

    Counter += 3;
  }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }
#endif

  //
  // Break from doubly nested try body with an exception clause in a
  // switch.
  //

  printf("    test46...");
  Counter = 0;
  Index1 = 1;
  switch (Index2) {
  case BLUE:
    Counter += 100;
    break;

  case RED:
    try {
      try {
        if ((Index1 & 0x1) == 1) {
          break;

        } else {
          Counter += 1;
        }
      }
      except(EXCEPTION_EXECUTE_HANDLER) { Counter += 10; }

      Counter += 2;
    }
    except(EXCEPTION_EXECUTE_HANDLER) { Counter += 20; }

    Counter += 3;
  }

  if (Counter != 0) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

#if !defined(WIN_CE) // gotos from try/finally not allowed on WinCE
  //
  // Break from doubly nested try body with an finally clause in a switch.
  //

  printf("    test47...");
  Counter = 0;
  Index1 = 1;
  switch (Index2) {
  case BLUE:
    Counter += 100;
    break;

  case RED:
    try {
      try {
        if ((Index1 & 0x1) == 1) {
          break;

        } else {
          Counter += 1;
        }
      }
      finally { Counter += 2; }

      Counter += 3;
    }
    finally { Counter += 4; }

    Counter += 5;
  }

  if (Counter != 6) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Break from a finally clause in a switch.
  //

  printf("    test48...");
  Counter = 0;
  Index1 = 1;
  switch (Index2) {
  case BLUE:
    Counter += 100;
    break;

  case RED:
    try {
      if ((Index1 & 0x1) == 1) {
        Counter += 1;
      }
    }
    finally {
      Counter += 2;
      break;
    }

    Counter += 4;
  }

  if (Counter != 3) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Break from a doubly nested finally clause in a switch.
  //

  printf("    test49...");
  Counter = 0;
  Index1 = 1;
  switch (Index2) {
  case BLUE:
    Counter += 100;
    break;

  case RED:
    try {
      try {
        if ((Index1 & 0x1) == 1) {
          Counter += 1;
        }
      }
      finally {
        Counter += 2;
        break;
      }

      Counter += 4;
    }
    finally { Counter += 5; }

    Counter += 6;
  }

  if (Counter != 8) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Break from a doubly nested finally clause in a switch.
  //

  printf("    test50...");
  Counter = 0;
  Index1 = 1;
  switch (Index2) {
  case BLUE:
    Counter += 100;
    break;

  case RED:
    try {
      try {
        if ((Index1 & 0x1) == 1) {
          Counter += 1;
        }
      }
      finally { Counter += 2; }

      Counter += 4;
    }
    finally {
      Counter += 5;
      break;
    }

    Counter += 6;
  }

  if (Counter != 12) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }
#endif

  //
  // Leave from an if in a simple try/finally.
  //

  printf("    test51...");
  Counter = 0;
  try {
    if (Echo(Counter) == Counter) {
      Counter += 3;
      leave;

    } else {
      Counter += 100;
    }
  }
  finally {
    if (abnormal_termination() == FALSE) {
      Counter += 5;
    }
  }

  if (Counter != 8) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Leave from a loop in a simple try/finally.
  //

  printf("    test52...");
  Counter = 0;
  try {
    for (Index1 = 0; Index1 < 10; Index1 += 1) {
      if (Echo(Index1) == Index1) {
        Counter += 3;
        leave;
      }

      Counter += 100;
    }
  }
  finally {
    if (abnormal_termination() == FALSE) {
      Counter += 5;
    }
  }

  if (Counter != 8) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Leave from a switch in a simple try/finally.
  //

  printf("    test53...");
  Counter = 0;
  try {
    switch (Index2) {
    case BLUE:
      break;

    case RED:
      Counter += 3;
      leave;
    }

    Counter += 100;
  }
  finally {
    if (abnormal_termination() == FALSE) {
      Counter += 5;
    }
  }

  if (Counter != 8) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Leave from an if in doubly nested try/finally followed by a leave
  // from an if in the outer try/finally.
  //

  printf("    test54...");
  Counter = 0;
  try {
    try {
      if (Echo(Counter) == Counter) {
        Counter += 3;
        leave;

      } else {
        Counter += 100;
      }
    }
    finally {
      if (abnormal_termination() == FALSE) {
        Counter += 5;
      }
    }

    if (Echo(Counter) == Counter) {
      Counter += 3;
      leave;

    } else {
      Counter += 100;
    }
  }
  finally {
    if (abnormal_termination() == FALSE) {
      Counter += 5;
    }
  }

  if (Counter != 16) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

#if !defined(WIN_CE) // leave from finally not allowed on WinCE
  //
  // Leave from an if in doubly nested try/finally followed by a leave
  // from the finally of the outer try/finally.
  //

  printf("    test55...");
  Counter = 0;
  try {
    try {
      if (Echo(Counter) == Counter) {
        Counter += 3;
        leave;

      } else {
        Counter += 100;
      }
    }
    finally {
      if (abnormal_termination() == FALSE) {
        Counter += 5;
        leave;
      }
    }

    Counter += 100;
  }
  finally {
    if (abnormal_termination() == FALSE) {
      Counter += 5;
    }
  }

  if (Counter != 13) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }
#endif

  //
  // Try/finally within the except clause of a try/except that is always
  // executed.
  //

  printf("    test56...");
  Counter = 0;
  try {
    Counter += 1;
    RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
  }
  except(Counter) {
    try {
      Counter += 3;
    }
    finally {
      if (abnormal_termination() == FALSE) {
        Counter += 5;
      }
    }
  }

  if (Counter != 9) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Try/finally within the finally clause of a try/finally.
  //

  printf("    test57...");
  Counter = 0;
  try {
    Counter += 1;
  }
  finally {
    if (abnormal_termination() == FALSE) {
      try {
        Counter += 3;
      }
      finally {
        if (abnormal_termination() == FALSE) {
          Counter += 5;
        }
      }
    }
  }

  if (Counter != 9) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Try/except within the finally clause of a try/finally.
  //

  printf("    test58...");
#if !defined(NEST_IN_FINALLY)
  printf("skipped\n");
#else
  Counter = 0;
  try {
    Counter -= 1;
  }
  finally {
    try {
      Counter += 2;
      RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
    }
    except(Counter) {
      try {
        Counter += 3;
      }
      finally {
        if (abnormal_termination() == FALSE) {
          Counter += 5;
        }
      }
    }
  }

  if (Counter != 9) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }
#endif /* def(NEST_IN_FINALLY) */

  //
  // Try/except within the except clause of a try/except that is always
  // executed.
  //

  printf("    test59...");
  Counter = 0;
  try {
    Counter += 1;
    RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
  }
  except(Counter) {
    try {
      Counter += 3;
      RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
    }
    except(Counter - 3) { Counter += 5; }
  }

  if (Counter != 9) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Try with a Try which exits the scope with a goto
  //

  printf("    test60...");
  Counter = 0;
  try {
    try {
      goto outside;
    }
    except(1) { Counter += 1; }

  outside:
    RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
  }
  except(1) { Counter += 3; }

  if (Counter != 3) {
    printf("failed, count = %d\n", Counter);
  } else {
    printf("succeeded\n");
  }

  //
  // Try/except which gets an exception from a subfunction within
  // a try/finally which has a try/except in the finally clause
  //

  printf("    test61...");
#if !defined(NEST_IN_FINALLY)
  printf("skipped\n");
#else
  Counter = 0;
  try {
    Test61Part2(&Counter);
  }
  except(EXCEPTION_EXECUTE_HANDLER) { Counter += 11; }

  if (Counter != 24) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }
#endif /* def(NEST_IN_FINALLY) */

  //
  // Check for precision of exception on floating point
  //

  printf("    test62...");

#if defined(i386) || defined(_M_IA64) || defined(_M_ALPHA) || defined(_M_AMD64)

/* enable floating point overflow */
#if defined(i386)
  _control87(_control87(0, 0) & ~EM_OVERFLOW, _MCW_EM);
#else
  //
  // use portable version of _control87
  //
  _controlfp(_controlfp(0, 0) & ~EM_OVERFLOW, _MCW_EM);
#endif

  Counter = 0;
  try {
    doubleresult = SquareDouble(1.7e300);

    try {
      doubleresult = SquareDouble(1.0);
    }
    except(1) { Counter += 3; }
  }
  except(1) { Counter += 1; }

  if (Counter != 1) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

/* clear up pending unmasked exceptions and restore FP control registers */
#if defined(i386)
  _clear87();
  _control87(_control87(0, 0) | EM_OVERFLOW, 0xfffff);
#else
  _clearfp();
  _controlfp(_controlfp(0, 0) | EM_OVERFLOW, 0xfffff);
#endif

#else
  printf("skipped\n");
#endif

  //
  // A try/finally inside a try/except where an exception is raised in the
  // try/finally.
  //

  printf("    test63...");
  Counter = 0;
  try {
    try {
      Counter += 1;
    }
    finally {
      Counter += 3;
      RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
    }
  }
  except(1) { Counter += 6; }

  if (Counter != 10) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A try/finally inside a try/except where an exception is raised in the
  // in the try/except and the try/finally.
  //

  printf("    test64...");
  Counter = 0;
  try {
    try {
      Counter += 1;
      RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
    }
    finally {
      Counter += 3;
      RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
    }
  }
  except(1) { Counter += 6; }

  if (Counter != 10) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A try/finally inside a try/except where an exception is raised in the
  // try/finally.
  //

  printf("    test65...");
  Counter = 0;
  try {
    try {
      Counter += 1;
    }
    finally {
      Counter += 3;
      *BlackHole += *BadAddress;
      Counter += 13;
    }
  }
  except(1) { Counter += 6; }

  if (Counter != 10) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A try/finally inside a try/except where an exception is raised in the
  // in the try/except and the try/finally.
  //

  printf("    test66...");
  Counter = 0;
  try {
    try {
      Counter += 1;
      *BlackHole += *BadAddress;
      Counter += 13;
    }
    finally {
      Counter += 3;
      *BlackHole += *BadAddress;
      Counter += 13;
    }
  }
  except(1) { Counter += 6; }

  if (Counter != 10) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A try/finally inside a try/finally inside a try/except where an
  // exception is raised in the in the try/except and in try/finally.
  //

  printf("    test67...");
  try {
    try {
      *BlackHole += *BadAddress;
    }
    finally {
      try {
        Counter = 0;
      }
      finally {
        if (Counter != 0) {
          Counter += 1;
        }
      }

      Counter += 1;
      *BlackHole += *BadAddress;
    }
  }
  except(1) { Counter += 1; }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // A try/finally inside a try/finally inside a try/except where an
  // exception is raised in the in the try/except and in try/finally.
  //

  printf("    test68...");
  try {
    try {
      RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
    }
    finally {
      try {
        Counter = 0;
      }
      finally {
        if (Counter != 0) {
          Counter += 1;
        }
      }

      Counter += 1;
      RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
    }
  }
  except(1) { Counter += 1; }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

//
// Patch guard test 69.
//

#if defined(_AMD64_) || defined(_X86_)

  printf("    test69...");
  Counter = 0;
  try {
    PgTest69(&Counter, BadAddress);
  }
  except(EXCEPTION_EXECUTE_HANDLER) { printf("unexpected exception..."); }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  printf("    test70...");
  Counter = 0;
  try {
    PgTest70(&Counter, BadAddress);
  }
  except(EXCEPTION_EXECUTE_HANDLER) { printf("unexpected exception..."); }

  if (Counter != 2) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  printf("    test71...");
  Counter = 0;
  try {
    PgTest71(&Counter, BadAddress);
  }
  except(EXCEPTION_EXECUTE_HANDLER) { printf("unexpected exception..."); }

  if (Counter != 9) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  printf("    test72...");
  Counter = 0;
  try {
    PgTest72(&Counter, BadAddress);
  }
  except(EXCEPTION_EXECUTE_HANDLER) { printf("unexpected exception..."); }

  if (Counter != 12) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  printf("    test73...");
  Counter = 0;
  try {
    PgTest73(&Counter, BadAddress);
  }
  except(EXCEPTION_EXECUTE_HANDLER) { printf("unexpected exception..."); }

  if (Counter != 15) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  printf("    test74...");
  Counter = 0;
  try {
    PgTest74(&Counter, BadAddress);
  }
  except(EXCEPTION_EXECUTE_HANDLER) { printf("unexpected exception..."); }

  if (Counter != 18) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  printf("    test75...");
  Counter = 0;
  try {
    PgTest75(&Counter, BadAddress);
  }
  except(EXCEPTION_EXECUTE_HANDLER) { printf("unexpected exception..."); }

  if (Counter != 35) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  printf("    test76...");
  Counter = 0;
  try {
    PgTest76(&Counter, BadAddress);
  }
  except(EXCEPTION_EXECUTE_HANDLER) { printf("unexpected exception..."); }

  if (Counter != 40) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  printf("    test77...");
  Counter = 0;
  try {
    PgTest77(&Counter, BadAddress);
  }
  except(EXCEPTION_EXECUTE_HANDLER) { printf("unexpected exception..."); }

  if (Counter != 45) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  printf("    test78...");
  Counter = 0;
  try {
    PgTest78(&Counter, BadAddress);
  }
  except(EXCEPTION_EXECUTE_HANDLER) { printf("unexpected exception..."); }

  if (Counter != 50) {
    printf("failed, count = %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

#else
  printf("    test69...filter entered...succeeded\n");
  printf("    test70...filter entered...succeeded\n");
  printf("    test71...filter entered...succeeded\n");
  printf("    test72...filter entered...succeeded\n");
  printf("    test73...filter entered...succeeded\n");
  printf("    test74...filter entered...succeeded\n");
  printf("    test75...filter entered...succeeded\n");
  printf("    test76...filter entered...succeeded\n");
  printf("    test77...filter entered...succeeded\n");
  printf("    test78...filter entered...succeeded\n");
#endif

  if (LOBYTE(LOWORD(GetVersion())) < 6) {
    printf("    test79...");
    printf("filter 1...filter 2...finally 1...filter 1...filter 2...finally "
           "2...passed\n");
  } else {

    printf("    test79...");
    Counter = 0;
    try {
      Test79(&Counter, BadAddress);
    }
    except(printf("filter 2..."), EXCEPTION_EXECUTE_HANDLER) { Counter += 1; }

    if (Counter == 3) {
      printf("passed\n");

    } else {
      printf("failed  %d \n", Counter);
    }
  }

  printf("    test80...");
  if (Test80() != 0) {
    printf("failed\n");

  } else {
    printf("passed\n");
  }

  printf("    test81...");
  Counter = 0;
  Test81(&Counter);
  if (Counter != 1) {
    printf("failed  %d \n", Counter);

  } else {
    printf("passed\n");
  }

  printf("    test82...");
  Counter = 1;
  Test82(&Counter);
  if (Counter != 0) {
    printf("failed\n");

  } else {
    printf("succeeded\n");
  }

  printf("    test83...");
  if (Test83() != 0) {
    printf("failed\n");

  } else {
    printf("succeeded\n");
  }

  printf("    test84...");
  Counter = 0;
  Test84(&Counter);
  if (Counter != 2) {
    printf("failed\n");

  } else {
    printf("succeeded\n");
  }

  printf("    test85...");
  Counter = 0;
  Test85(&Counter);
  if (Counter != 7) {
    printf("failed\n");

  } else {
    printf("succeeded\n");
  }

  printf("    test86...");
  Counter = 0;
  Test86(&Counter);
  if (Counter != 4) {
    printf("failed %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  printf("    test87...");
  Counter = 0;
  Test87(&Counter);
  if (Counter != 104) {
    printf("failed %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  printf("    test88...");
  Counter = 0;
  Test88(&Counter);
  if (Counter != 6) {
    printf("failed %d\n", Counter);

  } else {
    printf("succeeded\n");
  }

  //
  // Announce end of exception test.
  //

  printf("End of exception test\n");
  return;
}

#pragma optimize("a", off)
VOID addtwo(long First, long Second, long *Place)

{

  RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
  *Place = First + Second;
  return;
}
#pragma optimize("", on)

VOID bar1(IN NTSTATUS Status, IN PLONG Counter) {

  try {
    foo1(Status);
  }
  finally {
    if (abnormal_termination() != FALSE) {
      *Counter = 99;

    } else {
      *Counter = 100;
    }
  }

  return;
}

VOID bar2(IN PLONG BlackHole, IN PLONG BadAddress, IN PLONG Counter) {

  try {
    foo2(BlackHole, BadAddress);
  }
  finally {
    if (abnormal_termination() != FALSE) {
      *Counter = 99;

    } else {
      *Counter = 100;
    }
  }

  return;
}

VOID dojump(IN jmp_buf JumpBuffer, IN PLONG Counter)

{

  try {
    try {
      *Counter += 1;
      RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
    }
    finally { *Counter += 1; }
  }
  finally {
    *Counter += 1;
    longjmp(JumpBuffer, 1);
  }
}

#if !defined(WIN_CE) // return through finally not allowed on WinCE
VOID eret(IN NTSTATUS Status, IN PLONG Counter)

{

  try {
    try {
      foo1(Status);
    }
    except((GetExceptionCode() == Status) ? EXCEPTION_EXECUTE_HANDLER
                                          : EXCEPTION_CONTINUE_SEARCH) {
      *Counter += 1;
      return;
    }
  }
  finally { *Counter += 1; }

  return;
}
#endif

VOID except1(IN PLONG Counter)

{

  try {
    *Counter += 5;
    RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
  }
  except(except3(GetExceptionInformation(), Counter)) { *Counter += 7; }

  *Counter += 9;
  return;
}

ULONG
except2(IN PEXCEPTION_POINTERS ExceptionPointers, IN PLONG Counter)

{

  PEXCEPTION_RECORD ExceptionRecord;

  ExceptionRecord = ExceptionPointers->ExceptionRecord;
  if ((ExceptionRecord->ExceptionCode == STATUS_UNSUCCESSFUL) &&
      ((ExceptionRecord->ExceptionFlags & EXCEPTION_NESTED_CALL) == 0)) {
    *Counter += 11;
    return EXCEPTION_EXECUTE_HANDLER;

  } else {
    *Counter += 13;
    return EXCEPTION_CONTINUE_SEARCH;
  }
}

ULONG
except3(IN PEXCEPTION_POINTERS ExceptionPointers, IN PLONG Counter)

{

  PEXCEPTION_RECORD ExceptionRecord;

  ExceptionRecord = ExceptionPointers->ExceptionRecord;
  if ((ExceptionRecord->ExceptionCode == STATUS_INTEGER_OVERFLOW) &&
      ((ExceptionRecord->ExceptionFlags & EXCEPTION_NESTED_CALL) == 0)) {
    *Counter += 17;
    RtlRaiseStatus(STATUS_UNSUCCESSFUL);

  } else if ((ExceptionRecord->ExceptionCode == STATUS_UNSUCCESSFUL) &&
             ((ExceptionRecord->ExceptionFlags & EXCEPTION_NESTED_CALL) != 0)) {
    *Counter += 19;
    return EXCEPTION_CONTINUE_SEARCH;
  }

  *Counter += 23;
  return EXCEPTION_EXECUTE_HANDLER;
}

VOID foo1(IN NTSTATUS Status)

{

  //
  // Raise exception.
  //

  RtlRaiseStatus(Status);
  return;
}

VOID foo2(IN PLONG BlackHole, IN PLONG BadAddress)

{

  //
  // Raise exception.
  //

  *BlackHole += *BadAddress;
  return;
}

#if !defined(WIN_CE) // return from finally not allowed on WinCE
VOID fret(IN PLONG Counter)

{

  try {
    try {
      *Counter += 1;
    }
    finally {
      *Counter += 1;
      return;
    }
  }
  finally { *Counter += 1; }

  return;
}
#endif

LONG Echo(IN LONG Value)

{
  return Value;
}

#if defined(NEST_IN_FINALLY)
VOID Test61Part2(IN OUT PULONG Counter) {
  try {
    *Counter -= 1;
    RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
  }
  finally {
    try {
      *Counter += 2;
      RtlRaiseStatus(STATUS_INTEGER_OVERFLOW);
    }
    except(EXCEPTION_EXECUTE_HANDLER) { *Counter += 5; }
    *Counter += 7;
  }
}
#endif /* def(NEST_IN_FINALLY) */

double SquareDouble(IN double op) {
  return exp(2.0 * log(op));
}
