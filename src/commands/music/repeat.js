import { ApplicationCommandOptionType } from "discord.js";
import { QueueRepeatMode } from "discord-player";
import { BaseEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "repeat",
  description: "Editar o modo de repetição",
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "status",
      description: "Mostra o modo de repetição atual.",
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "off",
      description: "Desativar repetição.",
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "queue",
      description: "Repetir fila inteira.",
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "song",
      description: "Repetir música atual",
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "autoplay",
      description:
        "Tocar automaticamente músicas similares à partir da fila atual",
    },
  ],
  category: "music",
  queueOnly: true,
  validateVC: true,
};

export function execute(interaction, queue) {
  const subCmd = interaction.options.getSubcommand(true);

  let description;
  switch (subCmd) {
    case "off":
      queue.setRepeatMode(QueueRepeatMode.OFF);
      description = "Repetição desativada.";
      break;
    case "song":
      queue.setRepeatMode(QueueRepeatMode.TRACK);
      description = "Repetindo música atual.";
      break;
    case "queue":
      queue.setRepeatMode(QueueRepeatMode.QUEUE);
      description = "Repetindo fila atual.";
      break;
    case "autoplay":
      queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
      description = "Modo autoplay ativado.";
      break;
    default: {
      const status = {
        0: "Off",
        1: "Track",
        2: "Queue",
        3: "Autoplay",
      }[queue.repeatMode];

      description = `Status de repetição: \`${status}\`.`;
    }
  }

  return interaction.reply({
    ephemeral: subCmd !== "status",
    embeds: [BaseEmbed().setDescription(description)],
  });
}
