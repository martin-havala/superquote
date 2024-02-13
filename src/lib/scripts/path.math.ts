import type { Font } from 'opentype.js';
import { PaperScope, Path, CompoundPath } from 'paper';

const paper = new PaperScope();
paper.setup(new paper.Size(1000, 800));

export function calc(
	text: string[],
	font: Font,
	fontSize = 52,
	lineHeight = 50
): { shadow: string[]; d: string }[] {
	if (!font) {
		return [];
	}

	const paths = text.map((line, i) => {
		const p = font.getPath(line, 0, i * lineHeight, fontSize);
		const pts: paper.Path[] = [];
		let path = new paper.Path();
		p.commands.map((cmd) => {
			switch (cmd.type) {
				case 'M':
					path.moveTo(cmd);
					break;
				case 'L':
					path.lineTo(cmd);
					break;
				case 'C':
					path.cubicCurveTo(
						{ x: cmd.x1, y: cmd.y1 },
						{ x: cmd.x2, y: cmd.y2 },
						{ x: cmd.x, y: cmd.y }
					);
					break;
				case 'Q':
					path.quadraticCurveTo({ x: cmd.x1, y: cmd.y1 }, { x: cmd.x, y: cmd.y });

					break;
				case 'Z':
					path.closePath();
					pts.push(path);
					path = new Path();
					break;
			}
		});
		return pts;
	});

	const linePaths = paths.map((p) => {
		const line = p.reduce((a, c) => {
			c.rotate(-18, { x: 0, y: 0 });
			a.addChild(c);
			return a;
		}, new CompoundPath({}));

		// TODO optimize & merge curves
		const shadow = (line.children as paper.Path[])
			.map((p) =>
				p.curves
					.map((s) => {
						const start = s.getNearestPoint({ x: -1000, y: s.point1.y });
						const end = s.getNearestPoint({ x: 1000, y: s.point1.y });
						const path = new paper.Path([
							new paper.Segment({ x: start.x, y: +1000 }),
							new paper.Segment({ x: start.x, y: start.y }),
							new paper.Segment({ x: end.x, y: end.y }),
							new paper.Segment({ x: end.x, y: +1000 })
						]);
						path.closePath();
						return path;
					})
					.reduce((a, c) => {
						a.addChild(c);
						return a;
					}, new CompoundPath({}))
			)
			.map((p) => (p.exportSVG({ precision: 2 }) as SVGElement).getAttribute('d')!)
			.join('\n');
		return { line, shadow };
	});
	const res = linePaths.map(({ line, shadow }) => ({
		shadow: [shadow],
		d: (line.exportSVG() as SVGElement).getAttribute('d')!
	}));
	return res;
}
