import { ApplicationCommandOptionType } from "discord.js";
import { BaseEmbed, ErrorEmbed } from "../../modules/Embeds.js";
import { useHistory } from "discord-player";

export const data = {
  name: "songs",
  description: "Mostrar músicas da fila e do histórico.",
  options: ["queue", "history"].map((type) => ({
    type: ApplicationCommandOptionType.Subcommand,
    name: type,
    description: `Mostrar músicas ${type}.`,
    options: [
      {
        name: "page",
        description: "Especificar página para visualizar (padrão: 1).",
        type: ApplicationCommandOptionType.Number,
        required: false,
        min_value: 1,
      },
    ],
  })),
  category: "music",
  queueOnly: true,
  validateVC: true,
};

export function execute(interaction, queue) {
  const type = interaction.options.getSubcommand();
  const history = useHistory(interaction.guildId);
  const songsdata =
    type === "history" ? history.tracks.data : queue.tracks.data;
  const songsLength = songsdata.length;

  if (!songsLength) {
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed(`Nenhuma música no ${type}.`)],
    });
  }

  let page = interaction.options.getNumber("page", false) ?? 1;
  const multiple = 10;
  const maxPage = Math.ceil(songsLength / multiple);

  if (page > maxPage) page = maxPage;

  const end = page * multiple;
  const start = end - multiple;
  const tracks = songsdata.slice(start, end);

  const embed = BaseEmbed()
    .setDescription(
      tracks
        .map(
          (track, i) =>
            `${start + i + 1} - [${track.title}](${track.url}) ~ [${track.requestedBy.toString()}]`
        )
        .join("\n")
    )
    .setFooter({
      text: `Página ${page} de ${maxPage} | Mostrando músicas ${start + 1} de ${
        end > songsLength ? songsLength : end
      } à ${songsLength}`,
      iconURL: interaction.user.displayAvatarURL(),
    });

  return interaction.reply({ ephemeral: true, embeds: [embed] });
}
