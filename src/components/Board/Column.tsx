import { useDrop } from "react-dnd";
import Task from "./Task";
import { deleleTask, createTask, saveToLocalStorage } from "../../redux/slice";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

interface Props {
  index: number;
  column: Column;
}

const Column = ({ column, index }: Props) => {
  const { id, name, tasks, color } = column;
  const dispatch = useDispatch();

  // eslint-disable-next-line no-empty-pattern
  const [{}, drop] = useDrop(() => ({
    accept: "Task",
    drop: (item: { task: Task; columnId: number }) => {
      handleStatusChange(item.task, item.columnId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleStatusChange = (task: Task, previousColumnId: number) => {
    if (id === previousColumnId) return;

    const edited: Task = { ...task, status: id };
    dispatch(deleleTask({ taskId: task.id, columnId: previousColumnId }));
    dispatch(createTask(edited));
    dispatch(saveToLocalStorage());
  };

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ bounce: 1, duration: 0.15, delay: 0.1 * index }}
      ref={drop}
      className="flex min-w-[256px] flex-col gap-6 md:min-w-[296px] "
    >
      <div className="flex items-center gap-4">
        <div className="size-4 rounded-full" style={{ backgroundColor: color }}></div>
        <h3 className="font-bold uppercase tracking-[4px] text-text md:text-sm">
          {name} ({tasks.length})
        </h3>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        {tasks.length === 0 ? (
          <p className="font-bold text-magenta-900 dark:text-lightGray md:text-base">Add a task to this column!</p>
        ) : (
          tasks.map((task: Task) => <Task columnId={id} key={task.id} task={task} />)
        )}
      </div>
    </motion.div>
  );
};

export default Column;
