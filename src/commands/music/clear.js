import { ApplicationCommandOptionType } from "discord.js";
import { useHistory } from "discord-player";
import { ErrorEmbed, SuccessEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "clear",
  description: "Remove todas as musicas da fila, histórico, ou todos",
  options: [
    {
      name: "queue",
      description: "Remove todas as musicas da fila.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "history",
      description: "Remove todas as musicas do histórico.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "all",
      description: "Remove todas as musicas da fila e histórico.",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  category: "music",
  queueOnly: true,
  validateVC: true,
};

export function execute(interaction, queue) {
  const subcmd = interaction.options.getSubcommand();
  const history = useHistory(interaction.guildId);

  if ((subcmd === "queue" || subcmd === "all") && queue.isEmpty()) {
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("A fila já está vazia.")],
    });
  }
  if ((subcmd === "history" || subcmd === "all") && history.isEmpty()) {
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("O histórico já está vazio.")],
    });
  }

  switch (subcmd) {
    case "queue":
      queue.tracks.clear();
      break;
    case "history":
      history.clear();
      break;
    default:
      queue.clear();
      break;
  }

  return interaction.reply({
    embeds: [
      SuccessEmbed(
        `Cleared ${subcmd === "all" ? "all the" : `the ${subcmd}`} tracks.`
      ),
    ],
  });
}
