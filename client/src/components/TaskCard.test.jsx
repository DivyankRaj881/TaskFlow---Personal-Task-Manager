import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TaskCard from "./TaskCard";

const task = {
  id: 1,
  title: "Buy groceries",
  description: "Milk and eggs",
  completed: false,
  due_date: null,
};

describe("TaskCard delete confirmation", () => {
  it("shows confirmation popup after clicking Delete", async () => {
    const user = userEvent.setup();

    render(
      <TaskCard
        task={task}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /delete task/i })).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to delete "buy groceries"/i)
    ).toBeInTheDocument();
  });

  it("does not delete when Cancel is clicked in the popup", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <TaskCard
        task={task}
        onToggle={vi.fn()}
        onDelete={onDelete}
        onEdit={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /^delete$/i }));
    await user.click(screen.getByRole("button", { name: /^cancel$/i }));

    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("deletes the task when Yes, delete is clicked in the popup", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <TaskCard
        task={task}
        onToggle={vi.fn()}
        onDelete={onDelete}
        onEdit={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /^delete$/i }));
    await user.click(screen.getByRole("button", { name: /^yes, delete$/i }));

    expect(onDelete).toHaveBeenCalledWith(task.id);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});
