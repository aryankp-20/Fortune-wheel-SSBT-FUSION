/**
 * data/tasks.js
 * -----------------------------------------------------------------------
 * Single source of truth for every wheel outcome.
 * Each entry MUST correspond to a number on the fortune wheel (1–10).
 *
 * To customize the challenge, edit ONLY this file — the UI (TasksSection,
 * ResultModal, FortuneWheel) automatically renders whatever is defined here.
 *
 * Shape:
 *   {
 *     number: <int 1-10>,      // must match a wheel segment
 *     title: <string>,          // short task name shown on cards & popup
 *     description: <string>,    // longer instructions / lorem ipsum for now
 *   }
 * -----------------------------------------------------------------------
 */

export const tasks = [
  {
    number: 1,
    title: "Task 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    number: 2,
    title: "Task 2",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    number: 3,
    title: "Task 3",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    number: 4,
    title: "Task 4",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    number: 5,
    title: "Task 5",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam.",
  },
  {
    number: 6,
    title: "Task 6",
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
  },
  {
    number: 7,
    title: "Task 7",
    description:
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam.",
  },
  {
    number: 8,
    title: "Task 8",
    description:
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi.",
  },
  {
    number: 9,
    title: "Task 9",
    description:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum.",
  },
  {
    number: 10,
    title: "Task 10",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
  },
];

/**
 * Helper — look up a task by its wheel number.
 * Falls back to a safe placeholder if a number is ever missing from the list,
 * so the UI never crashes even if tasks.js is edited incorrectly.
 */
export function getTaskByNumber(number) {
  return (
    tasks.find((task) => task.number === number) || {
      number,
      title: `Task ${number}`,
      description: "No task description has been configured for this number yet.",
    }
  );
}
