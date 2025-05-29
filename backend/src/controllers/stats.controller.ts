import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { getResetStat } from '../utils/resetStat';
import { startOfWeek, differenceInDays } from "date-fns"


// Get previous stat
export const getPreviousStat = async (req: Request, res: Response): Promise<void> => {
    const { statName } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (!user || error) {
            res.status(401).json({ success: false });
            return;
        }

        const { data, error: dbError } = await supabase
            .from('health_stats')
            .select('previous')
            .eq('user_id', user.id)
            .eq('stat_name', statName)
            .single();

          if (dbError) {
             res.status(200).json({
                success: true,
                data: null
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: data.previous
        });
    } catch (err) {
        res.status(500).json({
            success: false,
        });
    }
};

// Save or update stat
export const saveStat = async (req: Request, res: Response): Promise<void> => {
    const { statName } = req.params;
    const { newData } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (!user || error) {
            res.status(401).json({ success: false });
            return
        }

        // Get existing stat
        const { data: existingStat } = await supabase
            .from('health_stats')
            .select('current')
            .eq('user_id', user.id)
            .eq('stat_name', statName)
            .single();

        const updateData = {
            user_id: user.id,
            stat_name: statName,
            current: newData,
            previous: existingStat?.current || null,
            last_updated: new Date().toISOString()
        };

        // Upsert operation
        const { error: upsertError } = await supabase
            .from('health_stats')
            .upsert(updateData, {
                onConflict: 'user_id, stat_name'
            });

        if (upsertError) {
            res.status(500).json({
                success: false,
            });
            return;
        }

        res.status(200).json({
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
        });
    }
};

export const archiveStats = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!user || error) {
            res.status(401).json({ success: false });
            return;
        }

        // Get all stats for user
        const { data: allStats, error: fetchError } = await supabase
            .from('health_stats')
            .select('*')
            .eq('user_id', user.id);

        if (fetchError) {
            res.status(500).json({
                success: false,
            });
            return;
        }

        const now = new Date();
        const updates = [];

        for (const stat of allStats) {
            if (!stat.current?.lastUpdated) continue;
            const lastDate = new Date(stat.current.lastUpdated);

            // Weekly stats (every Monday)
            if (['targetRange', 'highLow', 'morningEvening'].includes(stat.stat_name)) {
                const lastWeekStart = startOfWeek(lastDate, { weekStartsOn: 1 });
                const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });

                if (lastWeekStart < currentWeekStart) {
                    updates.push({
                        id: stat.id,
                        previous: stat.current,
                        current: getResetStat(stat.stat_name, now)
                    });
                }
            }

            // 7-day average
            else if (stat.stat_name === 'sevenDayAverage') {
                const daysSinceUpdate = differenceInDays(now, lastDate);
                if (daysSinceUpdate >= 7) {
                    updates.push({
                        id: stat.id,
                        previous: stat.current,
                        current: {
                            value: "--",
                            description: "no readings available.",
                            lastUpdated: now.toISOString()
                        }
                    });
                }
            }

            // Monthly stats
            else if (stat.stat_name === 'monthlyChange') {
                const lastMonth = lastDate.getMonth();
                const currentMonth = now.getMonth();
                if (lastMonth !== currentMonth) {
                    updates.push({
                        id: stat.id,
                        previous: stat.current,
                        current: {
                            value: "--",
                            description: "New month - tracking in progress",
                            lastUpdated: now.toISOString()
                        }
                    });
                }
            }
        }

        // Batch update
        for (const update of updates) {
            await supabase
                .from('health_stats')
                .update({
                    previous: update.previous,
                    current: update.current,
                    last_updated: now.toISOString()
                })
                .eq('id', update.id);
        }

        res.status(200).json({
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
        });
    }
};