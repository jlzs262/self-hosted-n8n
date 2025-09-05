import { GlobalConfig } from '@n8n/config';
import { Container } from '@n8n/di';

export const schema = {
	executions: {
		mode: {
			doc: 'If it should run executions directly or via queue',
			format: ['regular', 'queue'] as const,
			default: 'regular',
			env: 'EXECUTIONS_MODE',
		},

		// A Workflow times out and gets canceled after this time (seconds).
		// If the workflow is executed in the main process a soft timeout
		// is executed (takes effect after the current node finishes).
		// If a workflow is running in its own process is a soft timeout
		// tried first, before killing the process after waiting for an
		// additional fifth of the given timeout duration.
		//
		// To deactivate timeout set it to -1
		//
		// Timeout is currently not activated by default which will change
		// in a future version.
		timeout: {
			doc: 'Max run time (seconds) before stopping the workflow execution',
			format: Number,
			default: -1,
			env: 'EXECUTIONS_TIMEOUT',
		},
		maxTimeout: {
			doc: 'Max execution time (seconds) that can be set for a workflow individually',
			format: Number,
			default: 3600,
			env: 'EXECUTIONS_TIMEOUT_MAX',
		},

		// If a workflow executes all the data gets saved by default. This
		// could be a problem when a workflow gets executed a lot and processes
		// a lot of data. To not exceed the database's capacity it is possible to
		// prune the database regularly or to not save the execution at all.
		// Depending on if the execution did succeed or error a different
		// save behaviour can be set.
		saveDataOnError: {
			doc: 'What workflow execution data to save on error',
			format: ['all', 'none'] as const,
			default: 'all',
			env: 'EXECUTIONS_DATA_SAVE_ON_ERROR',
		},
		saveDataOnSuccess: {
			doc: 'What workflow execution data to save on success',
			format: ['all', 'none'] as const,
			default: 'all',
			env: 'EXECUTIONS_DATA_SAVE_ON_SUCCESS',
		},
		saveExecutionProgress: {
			doc: 'Whether or not to save progress for each node executed',
			format: Boolean,
			default: false,
			env: 'EXECUTIONS_DATA_SAVE_ON_PROGRESS',
		},

		// If the executions of workflows which got started via the editor
		// should be saved. By default they will not be saved as this runs
		// are normally only for testing and debugging. This setting can
		// also be overwritten on a per workflow basis in the workflow settings
		// in the editor.
		saveDataManualExecutions: {
			doc: 'Save data of executions when started manually via editor',
			format: Boolean,
			default: true,
			env: 'EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS',
		},

		// To not exceed the database's capacity and keep its size moderate
		// the execution data gets pruned regularly (default: 15 minute interval).
		// All saved execution data older than the max age will be deleted.
		// Pruning is currently not activated by default, which will change in
		// a future version.
		pruneData: {
			doc: 'Delete data of past executions on a rolling basis',
			format: Boolean,
			default: true,
			env: 'EXECUTIONS_DATA_PRUNE',
		},
		pruneDataMaxAge: {
			doc: 'How old (hours) the finished execution data has to be to get soft-deleted',
			format: Number,
			default: 336,
			env: 'EXECUTIONS_DATA_MAX_AGE',
		},
		pruneDataHardDeleteBuffer: {
			doc: 'How old (hours) the finished execution data has to be to get hard-deleted. By default, this buffer excludes recent executions as the user may need them while building a workflow.',
			format: Number,
			default: 1,
			env: 'EXECUTIONS_DATA_HARD_DELETE_BUFFER',
		},
		pruneDataIntervals: {
			hardDelete: {
				doc: 'How often (minutes) execution data should be hard-deleted',
				format: Number,
				default: 15,
				env: 'EXECUTIONS_DATA_PRUNE_HARD_DELETE_INTERVAL',
			},
			softDelete: {
				doc: 'How often (minutes) execution data should be soft-deleted',
				format: Number,
				default: 60,
				env: 'EXECUTIONS_DATA_PRUNE_SOFT_DELETE_INTERVAL',
			},
		},

		// Additional pruning option to delete executions if total count exceeds the configured max.
		// Deletes the oldest entries first
		// Set to 0 for No limit
		pruneDataMaxCount: {
			doc: "Maximum number of finished executions to keep in DB. Doesn't necessarily prune exactly to max number. 0 = no limit",
			format: Number,
			default: 10000,
			env: 'EXECUTIONS_DATA_PRUNE_MAX_COUNT',
		},
	},

	queue: {
		health: {
			active: {
				doc: 'If health checks should be enabled',
				format: Boolean,
				default: false,
				env: 'QUEUE_HEALTH_CHECK_ACTIVE',
			},
			port: {
				doc: 'Port to serve health check on if activated',
				format: Number,
				default: 5678,
				env: 'QUEUE_HEALTH_CHECK_PORT',
			},
		},
		bull: {
			prefix: {
				doc: 'Prefix for all bull queue keys',
				format: String,
				default: 'bull',
				env: 'QUEUE_BULL_PREFIX',
			},
			redis: {
				db: {
					doc: 'Redis DB',
					format: Number,
					default: 0,
					env: 'QUEUE_BULL_REDIS_DB',
				},
				host: {
					doc: 'Redis Host',
					format: String,
					default: 'localhost',
					env: 'QUEUE_BULL_REDIS_HOST',
				},
				password: {
					doc: 'Redis Password',
					format: String,
					default: '',
					env: 'QUEUE_BULL_REDIS_PASSWORD',
				},
				port: {
					doc: 'Redis Port',
					format: Number,
					default: 6379,
					env: 'QUEUE_BULL_REDIS_PORT',
				},
				timeoutThreshold: {
					doc: 'Redis timeout threshold',
					format: Number,
					default: 10000,
					env: 'QUEUE_BULL_REDIS_TIMEOUT_THRESHOLD',
				},
				username: {
					doc: 'Redis Username (needs Redis >= 6)',
					format: String,
					default: '',
					env: 'QUEUE_BULL_REDIS_USERNAME',
				},
				clusterNodes: {
					doc: 'Redis Cluster startup nodes (comma separated list of host:port pairs)',
					format: String,
					default: '',
					env: 'QUEUE_BULL_REDIS_CLUSTER_NODES',
				},
				tls: {
					format: Boolean,
					default: false,
					env: 'QUEUE_BULL_REDIS_TLS',
					doc: 'Enable TLS on Redis connections. Default: false',
				},
			},
			queueRecoveryInterval: {
				doc: 'If > 0 enables an active polling to the queue that can recover for Redis crashes. Given in seconds; 0 is disabled. May increase Redis traffic significantly.',
				format: Number,
				default: 60,
				env: 'QUEUE_RECOVERY_INTERVAL',
			},
			gracefulShutdownTimeout: {
				doc: '[DEPRECATED] (Use N8N_GRACEFUL_SHUTDOWN_TIMEOUT instead) How long should n8n wait for running executions before exiting worker process (seconds)',
				format: Number,
				default: 30,
				env: 'QUEUE_WORKER_TIMEOUT',
			},
			settings: {
				lockDuration: {
					doc: 'How long (ms) is the lease period for a worker to work on a message',
					format: Number,
					default: 30000,
					env: 'QUEUE_WORKER_LOCK_DURATION',
				},
				lockRenewTime: {
					doc: 'How frequently (ms) should a worker renew the lease time',
					format: Number,
					default: 15000,
					env: 'QUEUE_WORKER_LOCK_RENEW_TIME',
				},
				stalledInterval: {
					doc: 'How often check for stalled jobs (use 0 for never checking)',
					format: Number,
					default: 30000,
					env: 'QUEUE_WORKER_STALLED_INTERVAL',
				},
				maxStalledCount: {
					doc: 'Max amount of times a stalled job will be re-processed',
					format: Number,
					default: 1,
					env: 'QUEUE_WORKER_MAX_STALLED_COUNT',
				},
			},
		},
	},

	generic: {
		// The timezone to use. Is important for nodes like "Cron" which start the
		// workflow automatically at a specified time. This setting can also be
		// overwritten on a per workflow basis in the workflow settings in the
		// editor.
		timezone: {
			doc: 'The timezone to use',
			format: '*',
			default: 'America/New_York',
			env: 'GENERIC_TIMEZONE',
		},

		instanceType: {
			doc: 'Type of n8n instance',
			format: ['main', 'webhook', 'worker'] as const,
			default: 'main',
		},

		releaseChannel: {
			doc: 'N8N release channel',
			format: ['stable', 'beta', 'nightly', 'dev'] as const,
			default: 'dev',
			env: 'N8N_RELEASE_TYPE',
		},

		gracefulShutdownTimeout: {
			doc: 'How long should n8n process wait for components to shut down before exiting the process (seconds)',
			format: Number,
			default: 30,
			env: 'N8N_GRACEFUL_SHUTDOWN_TIMEOUT',
		},
	},

	// How n8n can be reached (Editor & REST-API)
	path: {
		format: String,
		default: '/',
		arg: 'path',
		env: 'N8N_PATH',
		doc: 'Path n8n is deployed to',
	},
	host: {
		format: String,
		default: 'localhost',
		arg: 'host',
		env: 'N8N_HOST',
		doc: 'Host name n8n can be reached',
	},
	port: {
		format: Number,
		default: 5678,
		arg: 'port',
		env: 'N8N_PORT',
		doc: 'HTTP port n8n can be reached',
	},
	listen_address: {
		format: String,
		default: '0.0.0.0',
		env: 'N8N_LISTEN_ADDRESS',
		doc: 'IP address n8n should listen on',
	},
	protocol: {
		format: ['http', 'https'] as const,
		default: 'http',
		env: 'N8N_PROTOCOL',
		doc: 'HTTP Protocol via which n8n can be reached',
	},
	secure_cookie: {
		doc: 'This sets the `Secure` flag on n8n auth cookie',
		format: Boolean,
		default: true,
		env: 'N8N_SECURE_COOKIE',
	},
	ssl_key: {
		format: String,
		default: '',
		env: 'N8N_SSL_KEY',
		doc: 'SSL Key for HTTPS Protocol',
	},
	ssl_cert: {
		format: String,
		default: '',
		env: 'N8N_SSL_CERT',
		doc: 'SSL Cert for HTTPS Protocol',
	},
	editorBaseUrl: {
		format: String,
		default: '',
		env: 'N8N_EDITOR_BASE_URL',
		doc: 'Public URL where the editor is accessible. Also used for emails sent from n8n.',
	},

	security: {
		restrictFileAccessTo: {
			doc: 'If set only files in that directories can be accessed. Multiple directories can be separated by semicolon (";").',
			format: String,
			default: '',
			env: 'N8N_RESTRICT_FILE_ACCESS_TO',
		},
		blockFileAccessToN8nFiles: {
			doc: 'If set to true it will block access to all files in the ".n8n" directory and user defined config files.',
			format: Boolean,
			default: true,
			env: 'N8N_BLOCK_FILE_ACCESS_TO_N8N_FILES',
		},
		audit: {
			daysAbandonedWorkflow: {
				doc: 'Days for a workflow to be considered abandoned if not executed',
				format: Number,
				default: 90,
				env: 'N8N_SECURITY_AUDIT_DAYS_ABANDONED_WORKFLOW',
			},
		},
	},

	endpoints: {
		payloadSizeMax: {
			format: Number,
			default: 16,
			env: 'N8N_PAYLOAD_SIZE_MAX',
			doc: 'Maximum payload size in MB.',
		},
		metrics: {
			enable: {
				format: Boolean,
				default: false,
				env: 'N8N_METRICS',
				doc: 'Enable /metrics endpoint. Default: false',
			},
			prefix: {
				format: String,
				default: 'n8n_',
				env: 'N8N_METRICS_PREFIX',
				doc: 'An optional prefix for metric names. Default: n8n_',
			},
			includeDefaultMetrics: {
				format: Boolean,
				default: true,
				env: 'N8N_METRICS_INCLUDE_DEFAULT_METRICS',
				doc: 'Whether to expose default system and node.js metrics. Default: true',
			},
			includeWorkflowIdLabel: {
				format: Boolean,
				default: false,
				env: 'N8N_METRICS_INCLUDE_WORKFLOW_ID_LABEL',
				doc: 'Whether to include a label for the workflow ID on workflow metrics. Default: false',
			},
			includeNodeTypeLabel: {
				format: Boolean,
				default: false,
				env: 'N8N_METRICS_INCLUDE_NODE_TYPE_LABEL',
				doc: 'Whether to include a label for the node type on node metrics. Default: false',
			},
			includeCredentialTypeLabel: {
				format: Boolean,
				default: false,
				env: 'N8N_METRICS_INCLUDE_CREDENTIAL_TYPE_LABEL',
				doc: 'Whether to include a label for the credential type on credential metrics. Default: false',
			},
			includeApiEndpoints: {
				format: Boolean,
				default: false,
				env: 'N8N_METRICS_INCLUDE_API_ENDPOINTS',
				doc: 'Whether to expose metrics for API endpoints. Default: false',
			},
			includeApiPathLabel: {
				format: Boolean,
				default: false,
				env: 'N8N_METRICS_INCLUDE_API_PATH_LABEL',
				doc: 'Whether to include a label for the path of API invocations. Default: false',
			},
			includeApiMethodLabel: {
				format: Boolean,
				default: false,
				env: 'N8N_METRICS_INCLUDE_API_METHOD_LABEL',
				doc: 'Whether to include a label for the HTTP method (GET, POST, ...) of API invocations. Default: false',
			},
			includeApiStatusCodeLabel: {
				format: Boolean,
				default: false,
				env: 'N8N_METRICS_INCLUDE_API_STATUS_CODE_LABEL',
				doc: 'Whether to include a label for the HTTP status code (200, 404, ...) of API invocations. Default: false',
			},
			includeCacheMetrics: {
				format: Boolean,
				default: false,
				env: 'N8N_METRICS_INCLUDE_CACHE_METRICS',
				doc: 'Whether to include metrics for cache hits and misses. Default: false',
			},
			includeMessageEventBusMetrics: {
				format: Boolean,
				default: true,
				env: 'N8N_METRICS_INCLUDE_MESSAGE_EVENT_BUS_METRICS',
				doc: 'Whether to include metrics for events. Default: false',
			},
		},
		rest: {
			format: String,
			default: 'rest',
			env: 'N8N_ENDPOINT_REST',
			doc: 'Path for rest endpoint',
		},
		form: {
			format: String,
			default: 'form',
			env: 'N8N_ENDPOINT_FORM',
			doc: 'Path for form endpoint',
		},
		formTest: {
			format: String,
			default: 'form-test',
			env: 'N8N_ENDPOINT_FORM_TEST',
			doc: 'Path for test form endpoint',
		},
		formWaiting: {
			format: String,
			default: 'form-waiting',
			env: 'N8N_ENDPOINT_FORM_WAIT',
			doc: 'Path for waiting form endpoint',
		},
		webhook: {
			format: String,
			default: 'webhook',
			env: 'N8N_ENDPOINT_WEBHOOK',
			doc: 'Path for webhook endpoint',
		},
		webhookWaiting: {
			format: String,
			default: 'webhook-waiting',
			env: 'N8N_ENDPOINT_WEBHOOK_WAIT',
			doc: 'Path for waiting-webhook endpoint',
		},
		webhookTest: {
			format: String,
			default: 'webhook-test',
			env: 'N8N_ENDPOINT_WEBHOOK_TEST',
			doc: 'Path for test-webhook endpoint',
		},
		disableUi: {
			format: Boolean,
			default: false,
			env: 'N8N_DISABLE_UI',
			doc: 'Disable N8N UI (Frontend).',
		},
		disableProductionWebhooksOnMainProcess: {
			format: Boolean,
			default: false,
			env: 'N8N_DISABLE_PRODUCTION_MAIN_PROCESS',
			doc: 'Disable production webhooks from main process. This helps ensures no http traffic load to main process when using webhook-specific processes.',
		},
		additionalNonUIRoutes: {
			doc: 'Additional endpoints to not open the UI on. Multiple endpoints can be separated by colon (":")',
			format: String,
			default: '',
			env: 'N8N_ADDITIONAL_NON_UI_ROUTES',
		},
	},

	publicApi: {
		disabled: {
			format: Boolean,
			default: false,
			env: 'N8N_PUBLIC_API_DISABLED',
			doc: 'Whether to disable the Public API',
		},
		path: {
			format: String,
			default: 'api',
			env: 'N8N_PUBLIC_API_ENDPOINT',
			doc: 'Path for the public api endpoints',
		},
		swaggerUi: {
			disabled: {
				format: Boolean,
				default: false,
				env: 'N8N_PUBLIC_API_SWAGGERUI_DISABLED',
				doc: 'Whether to disable the Swagger UI for the Public API',
			},
		},
	},

	workflowTagsDisabled: {
		format: Boolean,
		default: false,
		env: 'N8N_WORKFLOW_TAGS_DISABLED',
		doc: 'Disable workflow tags.',
	},

	userManagement: {
		/**
		 * @important Do not remove until after cloud hooks are updated to stop using convict config.
		 */
		isInstanceOwnerSetUp: {
			// n8n loads this setting from DB on startup
			doc: "Whether the instance owner's account has been set up",
			format: Boolean,
			default: false,
		},

		authenticationMethod: {
			doc: 'How to authenticate users (e.g. "email", "ldap", "saml")',
			format: ['email', 'ldap', 'saml'] as const,
			default: 'email',
		},
	},

	/**
	 * @important Do not remove until after cloud hooks are updated to stop using convict config.
	 */
	endpoints: {
		rest: {
			format: String,
			default: Container.get(GlobalConfig).endpoints.rest,
		},
	},

	/**
	 * @important Do not remove until after cloud hooks are updated to stop using convict config.
	 */
	ai: {
		enabled: {
			format: Boolean,
			default: Container.get(GlobalConfig).ai.enabled,
		},
	},
};
